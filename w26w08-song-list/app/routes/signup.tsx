import { useState } from "react"
import { SignupForm as ShadcnSignupForm } from "@/components/signup-form"
import { useAuthStore } from "../lib/auth-store"
import { useNavigate } from "react-router"

export default function SignupForm() {
    const { signUp, status } = useAuthStore()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const handleSignup = async (e: React.SubmitEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            // return alert("비밀번호가 일치하지 않습니다.")
            return setError("비밀번호가 일치하지 않습니다.")
        }

        try {
            await signUp(email, password)
            // alert("Email 확인하여 인증하시기 바랍니다.")
            setError("Email 확인하여 인증하시기 바랍니다.")
            navigate("/login")
        } catch (err: any) {
            // alert(`회원가입 실패: ${err.message}`)
            setError(err.message)
        }
    }


    // return (
    //   <form onSubmit={handleSignup}>
    //     <h2>Email 회원가입 ({status})</h2>
    //     <input
    //       type="email"
    //       value={email}
    //       onChange={e => setEmail(e.target.value)}
    //       placeholder="이메일"
    //       required
    //     />
    //     <input
    //       type="password"
    //       value={password}
    //       onChange={e => setPassword(e.target.value)}
    //       placeholder="비밀번호"
    //       required
    //     />
    //     <input
    //       type="password"
    //       value={confirmPassword}
    //       onChange={e => setConfirmPassword(e.target.value)}
    //       placeholder="비밀번호 확인"
    //       required
    //     />
    //     <button
    //       type="submit"
    //       disabled={status === "authenticated"}>
    //       회원가입
    //     </button>
    //   </form>
    // )


    return (
        <div className="flex min-h-[calc(100svh-4rem)] justify-center items-center px-4">
            <ShadcnSignupForm
                className="w-full max-w-sm"
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleSignup}
                loading={status === "loading"}
                error={error} passwordConfirm={""} onPasswordConfirmChange={function (value: string): void {
                throw new Error("Function not implemented.")
            }}            />
        </div>
    )
}
