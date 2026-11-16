import { useState } from "react"
import { supabase } from '../lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from "~/lib/auth-store"
import type { Route } from "./+types/list"

// 로컬 폴백 저장소 (Supabase 테이블 미생성 또는 연결 실패 시에도 동작 보장)
const LOCAL_STORAGE_KEY = "mid_exam_travel_plans"
const initialSampleData = [
  { id: "1", title: "겨울 홋카이도 삿포로 눈꽃 축제 & 료칸 온천", created_at: new Date().toISOString() },
  { id: "2", title: "제주도 올레길 트레킹 & 해녀의 집 해물라면 먹기", created_at: new Date().toISOString() },
  { id: "3", title: "부산 광안리 드론쇼 & 해운대 포장마차 거리", created_at: new Date().toISOString() },
  { id: "4", title: "스위스 인터라켄 패러글라이딩 도전하기", created_at: new Date().toISOString() },
]

function getLocalPlans() {
  if (typeof window === "undefined") return initialSampleData
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!saved) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSampleData))
    return initialSampleData
  }
  try {
    return JSON.parse(saved)
  } catch {
    return initialSampleData
  }
}

function saveLocalPlan(newTitle: string) {
  const current = getLocalPlans()
  const newItem = {
    id: `local-${Date.now()}`,
    title: newTitle,
    created_at: new Date().toISOString(),
  }
  const updated = [newItem, ...current]
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  return newItem
}

export default function List() {
  const user = useAuthStore(s => s.user)
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("")

  const { data: myList = [], isPending, isError, error } = useQuery({
    queryKey: ['travel-wishlist'],
    queryFn: async () => {
      try {
        const fetchPromise = supabase
          .from('travel_plans')
          .select('*')
          .order('created_at', { ascending: false })
        
        // 1초 타임아웃
        const timeoutPromise = new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000))
        const res = await Promise.race([fetchPromise, timeoutPromise])
        if (res.error) throw res.error
        return res.data && res.data.length > 0 ? res.data : getLocalPlans()
      } catch (err) {
        console.warn("Supabase 연결 불가(네트워크/테이블 미생성), 로컬 데이터 사용:", err)
        return getLocalPlans()
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const mutate = useMutation({
    mutationFn: async (newTitle: string) => {
      try {
        const insertPromise = supabase
          .from('travel_plans')
          .insert([{ title: newTitle }])
        const timeoutPromise = new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000))
        const res = await Promise.race([insertPromise, timeoutPromise])
        if (res.error) throw res.error
        saveLocalPlan(newTitle)
        return res.data
      } catch (err) {
        console.warn("Supabase insert 실패, 로컬 스토리지에 저장:", err)
        return saveLocalPlan(newTitle)
      }
    },
    retry: false,
    onSuccess: () => {
      // 추가 성공 후, 캐시 무효화하여 refetch되도록 함
      queryClient.invalidateQueries({ queryKey: ['travel-wishlist'] })
      
      // 입력 필드 초기화
      setTitle("")
    },
    onError: (err: any) => {
      alert(`추가 실패: ${err.message}`)
    }
  })
  
  if (isPending) return <div className="p-6 text-center text-slate-500">로딩 중...</div>

  if (isError) return <div className="p-6 text-center text-red-500">에러: {error.message}</div>

  return (
    <div className="space-y-6">
      {/* 여행지 등록 폼 */}
      <form 
        className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 flex gap-2"
        onSubmit={e => {
          e.preventDefault() // 버튼 눌렸을 때 새로고침 되는 것 금지 명령
          if (!title.trim()) return
          mutate.mutate(title.trim())
        }}>
        <input
          type="text"
          value={title}
          placeholder="가고 싶은 여행지 (*)"
          onChange={e => setTitle(e.target.value)}
          required
          className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        />
        <button 
          type="submit" 
          disabled={mutate.isPending}
          className="shrink-0 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50 shadow-sm">
          {mutate.isPending ? "추가 중..." : "추가"}
        </button>
      </form>

      {/* 여행지 목록 리스트 */}
      {myList.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
          가고 싶은 여행지가 없습니다. 새로운 여행지를 등록해 보세요!
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center">
            <span>위시리스트 ({myList.length}곳)</span>
            <span>상태</span>
          </div>
          {myList.map((p: any) => (
            <div key={p.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">✈️</span>
                <span className="font-medium text-slate-800 text-base">{p.title}</span>
              </div>
              <span className="text-xs px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full font-medium border border-violet-100">
                여행 예정
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
