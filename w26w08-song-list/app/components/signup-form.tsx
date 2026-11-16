import { cn } from "@/lib/utils"
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

interface SignupFormProps {
  email: string
  password: string
  passwordConfirm: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onPasswordConfirmChange: (value: string) => void
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  loading: boolean
  error: string | null
  className?: string
}

export function SignupForm({
                             className,
                             email,
                             password,
                             passwordConfirm,
                             onEmailChange,
                             onPasswordChange,
                             onPasswordConfirmChange,
                             onSubmit,
                             loading,
                             error,
                           }: SignupFormProps) {
  return (
      <Card className={cn("flex flex-col gap-6", className)}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
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
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your email
                  with anyone else.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    required />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                    id="confirm-password"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => onPasswordConfirmChange(e.target.value)}
                    required />
                <FieldDescription>Please confirm your password.</FieldDescription>
              </Field>

              {error && (
                  <Alert variant="destructive">
                    <AlertTitle>로그인 실패</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}

              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  계정이 이미 있으신가요? <Link to="/login">로그인</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
  )
}
