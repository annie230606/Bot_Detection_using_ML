"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bot, LogIn, UserPlus, AlertCircle, MailWarning, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showVerifyNotice, setShowVerifyNotice] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setShowVerifyNotice(false)
    setLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    if (isRegister) {
      if (!name.trim()) {
        setError("Please enter your name.")
        setLoading(false)
        return
      }
      const success = register(name.trim(), email.trim(), password)
      if (success) {
        setShowVerifyNotice(true)
        setLoading(false)
        setTimeout(() => router.push("/dashboard"), 1800)
        return
      } else {
        setError("An account with this email already exists.")
      }
    } else {
      const success = login(email.trim(), password)
      if (success) {
        const sessionRaw = localStorage.getItem("session")
        const session = sessionRaw ? JSON.parse(sessionRaw) : null
        if (session?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError("Invalid email or password.")
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary/10 p-3">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isRegister ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Sign up to start detecting bots"
              : "Sign in to access the dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showVerifyNotice && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-yellow-500/10 px-3 py-3 text-sm text-yellow-700 dark:text-yellow-400 border border-yellow-500/20">
              <MailWarning className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Verify your email</p>
                <p className="text-xs mt-0.5">Your account was created but your email is not yet verified. An admin can verify your email from the Admin Dashboard. Redirecting you now…</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {isRegister ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isRegister ? (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError("")
                setShowVerifyNotice(false)
              }}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {isRegister ? "Sign in" : "Register"}
            </button>
          </div>

          <div className="mt-3 text-center">
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Portal
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
