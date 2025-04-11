"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { motion as m } from "framer-motion"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useCreateAccount } from "@/api-hooks/user/create-user-account"
import type { UserResProps } from "@/lib/types/types"
import { deleteCookie, getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"

// Updated Zod schema to include name field for signup
const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export const SignUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function AuthForm() {
  const [isPassword, setIsPassword] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const router = useRouter()

  const callbackUrl = getCookie("originCallbackUrl") // Get callback url from cookie to redirect after login success.

  // Create separate forms for signin and signup
  const signinForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signupForm = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function handleSignIn(data: z.infer<typeof SignInSchema>) {
    setError(null)
    setIsLoading(true)

    try {
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: callbackUrl || "/",
      })

      if (signInResponse?.error) {
        signinForm.reset()
        throw new Error("Invalid credentials.")
      }
      toast.success("Signed in successfully. redirecting...")
      deleteCookie("originCallbackUrl") // Delete callbackUrl cookie after successful login
      router.refresh()
      router.replace(signInResponse?.url || "/")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onSuccess = (data: UserResProps, variables: z.infer<typeof SignUpSchema>) => {
    toast.success("Account created successfully!")
    // Auto sign in after account creation with email and password
    handleSignIn({ email: variables.email, password: variables.password })
  }

  const onError = ({ response }: { response: any }) => {
    setError(response.data.message)
  }

  const mutation = useCreateAccount(onSuccess, onError)

  async function handleCreateAccount(data: z.infer<typeof SignUpSchema>) {
    setError(null)
    mutation.mutate(data)
  }

  return (
    <div>
      {/* Custom tabs implementation */}
      <div className="mb-6 flex w-full border-b border-slate-200">
        <Button
          className={`flex-1 rounded-none border-b-2 bg-transparent px-8 py-2 font-medium ${
            activeTab === "signin"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => {
            setActiveTab("signin")
            setError(null)
            signupForm.reset() // Reset signup form when switching to signin
          }}
          type="button"
          variant="light"
        >
          Sign In
        </Button>
        <Button
          className={`flex-1 rounded-none border-b-2 bg-transparent px-8 py-2 font-medium ${
            activeTab === "signup"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => {
            setActiveTab("signup")
            setError(null)
            signinForm.reset() // Reset signin form when switching to signup
          }}
          type="button"
          variant="light"
        >
          Sign Up
        </Button>
      </div>

      {activeTab === "signin" ? (
        <Form {...signinForm}>
          <form>
            <FormField
              control={signinForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormControl>
                    <Input
                      placeholder="Email"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signinForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Password"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      endContent={
                        isPassword ? (
                          <Eye className="cursor-pointer text-gray-400" onClick={() => setIsPassword(false)} />
                        ) : (
                          <EyeOff className="cursor-pointer" onClick={() => setIsPassword(true)} />
                        )
                      }
                      type={isPassword ? "password" : "text"}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? (
              <m.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                }}
                className="mt-3 block h-5 text-center text-xs text-destructive"
              >
                {error}
              </m.span>
            ) : (
              <span className="mt-3 block h-5" />
            )}
            <div className="mt-5">
              <Button
                isLoading={isLoading}
                color="primary"
                onClick={signinForm.handleSubmit(handleSignIn)}
                radius="full"
                type="button"
                className="w-full"
              >
                Sign in
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...signupForm}>
            <FormField
              control={signupForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormControl>
                    <Input
                      placeholder="Name"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormControl>
                    <Input
                      placeholder="Email"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      radius="sm"
                      size="sm"
                      classNames={{
                        inputWrapper: "border border-slate-200",
                      }}
                      endContent={
                        isPassword ? (
                          <Eye className="cursor-pointer text-gray-400" onClick={() => setIsPassword(false)} />
                        ) : (
                          <EyeOff className="cursor-pointer" onClick={() => setIsPassword(true)} />
                        )
                      }
                      type={isPassword ? "password" : "text"}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? (
              <m.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                }}
                className="mt-3 block h-5 text-center text-xs text-destructive"
              >
                {error}
              </m.span>
            ) : (
              <span className="mt-3 block h-5" />
            )}
            <div className="mt-5">
              <Button
                isLoading={mutation.isLoading}
                color="primary"
                onClick={signupForm.handleSubmit(handleCreateAccount)}
                radius="full"
                type="button"
                className="w-full"
              >
                Create account
              </Button>
            </div>
        </Form>
      )}
    </div>
  )
}
