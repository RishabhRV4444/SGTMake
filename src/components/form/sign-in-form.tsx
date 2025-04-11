"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { SignInSchema } from "@/lib/zodSchemas"
import { motion as m } from "framer-motion"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { deleteCookie, getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@nextui-org/button"
export function SignInForm() {
  const [isPassword, setIsPassword] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [signInLoading, setSignInIsLoading] = useState(false)
  const router = useRouter()

  const callbackUrl = getCookie("originCallbackUrl") // Get callback url from cookie to redirect after login success.

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleSignIn(data: z.infer<typeof SignInSchema>) {
    setError(null)
    setSignInIsLoading(true)

    try {
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: callbackUrl || "/",
      })

      if (signInResponse?.error) {
        form.reset()
        throw new Error("Invalid credentials.")
      }
      toast.success("Signed in successfully. redirecting...")
      deleteCookie("originCallbackUrl") // Delete callbackUrl cookie after successful login
      router.refresh()
      router.replace(signInResponse?.url || "/")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSignInIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input {...field} placeholder="Password" type={isPassword ? "password" : "text"} />
                  <Button
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setIsPassword(!isPassword)}
                  >
                    {isPassword ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{isPassword ? "Show password" : "Hide password"}</span>
                  </Button>
                </div>
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
            className="block text-sm text-destructive"
          >
            {error}
          </m.span>
        ) : null}
        <Button type="submit" className="w-full" disabled={signInLoading}>
          {signInLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  )
}
