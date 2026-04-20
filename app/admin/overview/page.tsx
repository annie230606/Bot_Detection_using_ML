"use client"

import { useAuth } from "@/components/auth-context"
import { useEffect, useState } from "react"
import { Users, CheckCircle2, XCircle, Bot, TrendingUp, Activity, ShieldAlert, ScrollText } from "lucide-react"

interface StoredUser {
  email: string; name: string; role: "user" | "admin"
  emailVerified: boolean; createdAt: string
}

interface StoredPrediction {
  userEmail: string; userName: string; isoTimestamp: string
  svm: { prediction: string; confidence: number }
  random_forest: { prediction: string; confidence: number }
  xgboost: { prediction: string; confidence: number }
  features_received: { username?: string; follower_count?: number }
}

export default function OverviewPage() {
  const { getAllUsers } = useAuth()
  const [users, setUsers] = useState<StoredUser[]>([])
  const [predictions, setPredictions] = useState<StoredPrediction[]>([])

  useEffect(() => {
    // Only non-admin users
    const all = getAllUsers()
    setUsers(all.filter((u) => u.role === "user"))
    const preds = JSON.parse(localStorage.getItem("predictions") || "[]")
    setPredictions(preds)
  }, [])

  const total = users.length
  const verified = users.filter((u) => u.emailVerified).length
  const unverified = users.filter((u) => !u.emailVerified).length
  const totalPredictions = predictions.length
  const botPredictions = predictions.filter((p) => p.xgboost.prediction === "BOT").length
  const flagged = predictions.filter((p) => p.xgboost.prediction === "BOT" && p.xgboost.confidence >= 85).length
  const recent = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
  const recentLogs = predictions.slice(0, 5)

  const stats = [
    { label: "Registered Users", value: total, icon: Users, color: "bg-blue-500/10 text-blue-600", sub: "Non-admin accounts" },
    { label: "Verified Emails", value: verified, icon: CheckCircle2, color: "bg-green-500/10 text-green-600", sub: total ? Math.round((verified / total) * 100) + "% of users" : "0%" },
    { label: "Unverified", value: unverified, icon: XCircle, color: "bg-red-500/10 text-red-600", sub: "Needs verification" },
    { label: "Total Detections", value: totalPredictions, icon: ScrollText, color: "bg-purple-500/10 text-purple-600", sub: "All predictions run" },
    { label: "Bots Detected", value: botPredictions, icon: Bot, color: "bg-orange-500/10 text-orange-600", sub: "By XGBoost model" },
    { label: "High-Confidence Flags", value: flagged, icon: ShieldAlert, color: "bg-red-500/10 text-red-600", sub: "≥85% confidence" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Live platform statistics from real user activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={"rounded-lg p-2 " + s.color}><s.icon className="h-5 w-5" /></div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Recently Registered Users</h3>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No users registered yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recent.map((u) => (
                <div key={u.email} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {u.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  {u.emailVerified
                    ? <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Verified</span>
                    : <span className="text-xs text-red-500 flex items-center gap-1"><XCircle className="h-3 w-3" />Unverified</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Predictions */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Recent Bot Detections</h3>
          </div>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No predictions have been run yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentLogs.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.features_received?.username || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">by {p.userName} · {new Date(p.isoTimestamp).toLocaleDateString()}</p>
                  </div>
                  <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + (p.xgboost.prediction === "BOT" ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-600")}>
                    {p.xgboost.prediction}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
