import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Link  } from "react-router"

interface LoginFormProps {
  className?: string
  email: string
  password: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  loading: boolean
  error: string | null
}

export function LoginForm({
                            className,
                            email,
                            password,
                            onEmailChange,
                            onPasswordChange,
                            onSubmit,
                            loading,
                            error,
                          }: LoginFormProps) {
  return (
      <Card className={cn("flex flex-col gap-6", className)}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
              onSubmit={ onSubmit }>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    required />
              </Field>

              {error && (
                  <Alert variant="destructive">
                    <AlertTitle>로그인 실패</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}

              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  계정이 없으신가요? <Link to="/signup">회원 가입</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
  )
}
