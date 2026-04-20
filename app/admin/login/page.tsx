"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const success = login(email.trim(), password)
    if (success) {
      const sessionRaw = localStorage.getItem("session")
      const session = sessionRaw ? JSON.parse(sessionRaw) : null
      if (session?.role === "admin") {
        router.push("/admin/overview")
      } else {
        localStorage.removeItem("session")
        setError("Access denied. Administrators only.")
      }
    } else {
      setError("Invalid credentials.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-primary px-12 text-primary-foreground">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold mb-3">BotDetect Admin</h1>
        <p className="text-center text-primary-foreground/70 max-w-sm text-sm leading-relaxed">
          Secure administration portal for managing users, reviewing bot detection logs, and configuring system settings.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs text-center">
          {[
            { label: "User Management", desc: "Create & manage accounts" },
            { label: "Detection Logs", desc: "Full audit trail" },
            { label: "Flagged Accounts", desc: "Review suspicious users" },
            { label: "System Settings", desc: "Configure platform" },
          ].map((f) => (
            <div key={f.label} className="rounded-xl bg-white/10 px-3 py-3">
              <p className="text-xs font-semibold">{f.label}</p>
              <p className="text-xs text-primary-foreground/60 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">BotDetect Admin</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Administrator Login</h2>
          <p className="text-sm text-muted-foreground mb-8">Sign in to access the admin panel</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@botdetect.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Authenticating…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Not an admin?{" "}
            <a href="/login" className="font-medium text-primary hover:underline underline-offset-4">
              Regular user login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
