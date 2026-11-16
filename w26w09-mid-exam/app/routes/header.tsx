import { Outlet } from "react-router"
import { useAuthStore } from "~/lib/auth-store"
import { supabase } from '../lib/supabase'
import type { Route } from "./+types/header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "종강 여행 위시리스트" },
    { name: "description", content: "종강 후 꼭 가고 싶은 국내외 힐링 여행지" },
  ]
}

export async function clientLoader() {
  const store = useAuthStore.getState()

  if (store.status === "authenticated") return
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    store.setSession(session)
  } else {
    // 세션이 없다면 하드코딩된 계정으로 로그인 시도
    try {
      await store.signIn("gdhong@test.com", "pass123")
    } catch (error) {
      console.error("로그인 실패:", error)
    }
  }
}

export default function Header() {
  const user = useAuthStore(s => s.user)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="header bg-violet-900 text-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            ✈️ 종강하고 떠날 힐링 여행지
          </h1>
          <span className="text-sm bg-violet-800 px-3 py-1 rounded-full text-violet-200">
            {user?.email ?? "로그인 정보 없음"}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
