"use client"

import { useEffect, useState } from "react"
import { ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, Bot, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StoredPrediction {
  userEmail: string; userName: string; isoTimestamp: string
  svm: { prediction: string; confidence: number }
  random_forest: { prediction: string; confidence: number }
  xgboost: { prediction: string; confidence: number }
  features_received: { username?: string; follower_count?: number; retweet_count?: number; verified?: boolean }
}

interface FlaggedEntry extends StoredPrediction {
  id: string
  status: "pending" | "confirmed" | "dismissed"
  reason: string
  confidence: number
}

function getReason(p: StoredPrediction): string {
  const f = p.features_received
  if (f.follower_count !== undefined && f.follower_count < 10) return "Very low follower count"
  if (f.retweet_count !== undefined && f.follower_count !== undefined && f.follower_count > 0 && f.retweet_count / f.follower_count > 2) return "Unnatural retweet to follower ratio"
  if (!f.verified) return "Unverified account with bot-like features"
  return "High bot confidence score from ML model"
}

export default function FlaggedPage() {
  const [flagged, setFlagged] = useState<FlaggedEntry[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "dismissed">("all")

  const load = () => {
    const preds: StoredPrediction[] = JSON.parse(localStorage.getItem("predictions") || "[]")
    // Flag any prediction where XGBoost says BOT with >= 80% confidence
    const flags = preds
      .filter((p) => p.xgboost.prediction === "BOT" && p.xgboost.confidence >= 80)
      .map((p, i) => {
        const saved = JSON.parse(localStorage.getItem("flagged_statuses") || "{}")
        const id = p.userEmail + "_" + p.isoTimestamp
        return {
          ...p,
          id,
          status: (saved[id] || "pending") as "pending" | "confirmed" | "dismissed",
          reason: getReason(p),
          confidence: p.xgboost.confidence,
        }
      })
    setFlagged(flags)
  }

  useEffect(() => { load() }, [])

  const updateStatus = (id: string, status: string) => {
    const saved = JSON.parse(localStorage.getItem("flagged_statuses") || "{}")
    saved[id] = status
    localStorage.setItem("flagged_statuses", JSON.stringify(saved))
    load()
  }

  const displayed = filter === "all" ? flagged : flagged.filter((f) => f.status === filter)

  const statusBadge = (status: string) => {
    if (status === "confirmed") return <Badge className="bg-red-500/10 text-red-600 border-red-200">Confirmed Bot</Badge>
    if (status === "dismissed") return <Badge variant="secondary">Dismissed</Badge>
    return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">Pending Review</Badge>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Flagged Accounts</h2>
          <p className="text-sm text-muted-foreground mt-1">Predictions where XGBoost detected a bot with ≥80% confidence</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending Review", value: flagged.filter(f => f.status === "pending").length, icon: Clock, color: "text-orange-600" },
          { label: "Confirmed Bots", value: flagged.filter(f => f.status === "confirmed").length, icon: Bot, color: "text-red-600" },
          { label: "Dismissed", value: flagged.filter(f => f.status === "dismissed").length, icon: CheckCircle, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <s.icon className={"h-7 w-7 " + s.color} />
            <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "pending", "confirmed", "dismissed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={"rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors " + (filter === f ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground hover:text-foreground")}>
            {f} {f === "all" ? "(" + flagged.length + ")" : ""}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {displayed.length === 0 ? (
          <div className="py-16 text-center">
            <ShieldAlert className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {flagged.length === 0
                ? "No flagged accounts yet. Flags appear when users run predictions that return BOT with ≥80% confidence."
                : "No accounts in this category."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                {["Account / Handle", "Submitted By", "Reason", "Confidence", "Detected", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{a.features_received?.username || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">Followers: {a.features_received?.follower_count ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{a.userName}</p>
                    <p className="text-xs text-muted-foreground">{a.userEmail}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <span className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <AlertTriangle className="h-3.5 w-3.5 text-orange-500 mt-0.5 shrink-0" />{a.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted">
                        <div className={"h-1.5 rounded-full " + (a.confidence >= 90 ? "bg-red-500" : a.confidence >= 80 ? "bg-orange-500" : "bg-yellow-500")} style={{ width: a.confidence + "%" }} />
                      </div>
                      <span className="text-xs font-medium">{a.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(a.isoTimestamp).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{statusBadge(a.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {a.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-600 gap-1" onClick={() => updateStatus(a.id, "confirmed")}>
                            <XCircle className="h-3.5 w-3.5" /> Confirm
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-green-600 gap-1" onClick={() => updateStatus(a.id, "dismissed")}>
                            <CheckCircle className="h-3.5 w-3.5" /> Dismiss
                          </Button>
                        </>
                      )}
                      {a.status !== "pending" && (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => updateStatus(a.id, "pending")}>
                          <Clock className="h-3.5 w-3.5 mr-1" /> Reopen
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
