import { Outlet, Link, useNavigate  } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "~/lib/auth-store"
import { supabase } from '../lib/supabase'
import { Button, buttonVariants } from "@/components/ui/button"


export async function clientLoader() {
    if (useAuthStore.getState().status === "loading") {
        // 로그인 상태가 아직 로딩 중이면, 세션을 확인하고 상태를 업데이트
        const { data: { session } } = await supabase.auth.getSession()
        useAuthStore.getState().setSession(session)
    }
}

// 로딩 화면. HydrateFallback 이름 정해져 있음
export function HydrateFallback() {
    return <div>로그인 세션 연결 중...</div>
}

// 오류 화면. ErrorBoundary 이름 정해져 있음
export function ErrorBoundary() {
    return <div>오류 발생</div>
}

export default  function Layout() {
    const user = useAuthStore(s => s.user)
    const githubSignIn = useAuthStore(s => s.githubSignIn)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const UserMenu = () => (
        <Button
            onClick={ async () => {
                await useAuthStore.getState().signOut()
                queryClient.clear()
                navigate('/')
            }}>
            로그아웃
        </Button>
    )

    const GuestMenu = () => (
        <>
            <Link
                to="/login"
                className={buttonVariants()}>
                로그인
            </Link>
            <Link
                to="/signup"
                className={buttonVariants()}>
                회원가입
            </Link>
            <Button
                onClick={async () => {
                    try {
                        await githubSignIn()
                    } catch (err: any) {
                        alert(`GitHub 인증 실패: ${err.message}`)
                    }
                }}>
                GitHub 로그인
            </Button>
        </>
    )

    return (
        <div>
            <header className="header bg-blue-900 text-white p-4">
                <nav className="flex justify-between">
                    <Link
                        to="/"
                        className="text-lg font-semibold">
                        애창곡
                    </Link>
                    <div>
                        {user ? UserMenu() : GuestMenu()}
                    </div>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    )
}