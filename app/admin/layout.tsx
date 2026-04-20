"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  ScrollText,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Bot,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon } from "lucide-react"

const sidebarLinks = [
  { href: "/admin/overview",  label: "Overview",           icon: LayoutDashboard },
  { href: "/admin/users",     label: "User Management",    icon: Users },
  { href: "/admin/flagged",   label: "Flagged Accounts",   icon: AlertTriangle },
  { href: "/admin/logs",      label: "Bot Detection Logs", icon: ScrollText },
  { href: "/admin/reports",   label: "Reports & Analysis", icon: BarChart3 },
  { href: "/admin/settings",  label: "System Settings",    icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [ready, setReady] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (isLoginPage) return
    if (!user) { router.push("/admin/login"); return }
    if (user.role !== "admin") { router.push("/login"); return }
  }, [user, ready, isLoginPage, router])

  // Login page: render completely bare — no sidebar, no navbar
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!ready || !user || user.role !== "admin") return null

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r bg-card transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 border-b px-4 py-4 h-16">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-sm text-foreground">Admin Panel</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={collapsed ? link.label : undefined}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t px-2 py-3 flex flex-col gap-1">
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={() => { logout(); router.push("/admin/login") }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
            >
              {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <h1 className="text-sm font-semibold text-muted-foreground">
              {sidebarLinks.find((l) => pathname.startsWith(l.href))?.label ?? "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Bot className="h-3.5 w-3.5" />
              Back to App
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
