"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { SignUpSchema } from "@/lib/zodSchemas"
import { motion as m } from "framer-motion"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useCreateAccount } from "@/api-hooks/user/create-user-account"
import type { UserResProps } from "@/lib/types/types"
import { Input } from "@/components/ui/input"
import { Button } from "@nextui-org/button"
export function SignUpForm() {
  const [isPassword, setIsPassword] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function handleSignIn(data: z.infer<typeof SignUpSchema>) {
    try {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/",
      })
    } catch (error: any) {
      setError(error.message)
    }
  }

  const onSuccess = (data: UserResProps, variables: z.infer<typeof SignUpSchema>) => {
    toast.success("Account created successfully!")
    handleSignIn(variables) // Auto sign in after account creation.
  }

  const onError = ({ response }: { response: any }) => {
    setError(response.data.message)
  }

  const mutation = useCreateAccount(onSuccess, onError)

  async function handleCreateAccount(data: z.infer<typeof SignUpSchema>) {
    mutation.mutate(data)
    setError(null)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateAccount)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                    type="button"
                    variant="ghost"
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
        <Button type="submit" className="w-full" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  )
}
