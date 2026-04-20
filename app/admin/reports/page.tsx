"use client"

import { useEffect, useState } from "react"
import { BarChart3, TrendingUp, Bot, User, Cpu, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StoredPrediction {
  userEmail: string; userName: string; isoTimestamp: string
  svm: { prediction: string; confidence: number }
  random_forest: { prediction: string; confidence: number }
  xgboost: { prediction: string; confidence: number }
  features_received: { username?: string }
}

export default function ReportsPage() {
  const [preds, setPreds] = useState<StoredPrediction[]>([])

  const load = () => {
    const data: StoredPrediction[] = JSON.parse(localStorage.getItem("predictions") || "[]")
    setPreds(data)
  }

  useEffect(() => { load() }, [])

  const total = preds.length
  const xgbBots = preds.filter(p => p.xgboost.prediction === "BOT").length
  const xgbHumans = total - xgbBots
  const svmBots = preds.filter(p => p.svm.prediction === "BOT").length
  const rfBots = preds.filter(p => p.random_forest.prediction === "BOT").length

  const avgConf = total === 0 ? 0 : Math.round(
    preds.reduce((sum, p) => sum + p.xgboost.confidence, 0) / total * 10
  ) / 10

  // Last 7 days activity
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0)
    const next = new Date(d); next.setDate(next.getDate() + 1)
    const dayPreds = preds.filter(p => { const t = new Date(p.isoTimestamp); return t >= d && t < next })
    return {
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      total: dayPreds.length,
      bots: dayPreds.filter(p => p.xgboost.prediction === "BOT").length,
    }
  })
  const maxBar = Math.max(...days.map(d => d.total), 1)

  // By unique submitter
  const byUser = Object.entries(
    preds.reduce((acc, p) => {
      acc[p.userEmail] = acc[p.userEmail] || { name: p.userName, total: 0, bots: 0 }
      acc[p.userEmail].total++
      if (p.xgboost.prediction === "BOT") acc[p.userEmail].bots++
      return acc
    }, {} as Record<string, { name: string; total: number; bots: number }>)
  ).sort((a, b) => b[1].total - a[1].total).slice(0, 5)

  const modelStats = [
    { name: "XGBoost", bots: xgbBots, humans: xgbHumans, color: "bg-purple-500" },
    { name: "Random Forest", bots: rfBots, humans: total - rfBots, color: "bg-blue-500" },
    { name: "SVM", bots: svmBots, humans: total - svmBots, color: "bg-green-500" },
  ]

  if (total === 0) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Reports & Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">Platform analytics derived from real user prediction data</p>
        </div>
        <div className="rounded-xl border bg-card py-20 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm font-medium text-foreground">No data yet</p>
          <p className="text-xs text-muted-foreground mt-1">Reports will populate once users run predictions on the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">Analytics derived from real user prediction data</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[
          { label: "Total Predictions", value: String(total), sub: "All time", icon: Cpu, color: "text-blue-600" },
          { label: "Bot Detection Rate", value: total > 0 ? Math.round((xgbBots / total) * 100) + "%" : "0%", sub: "XGBoost results", icon: Bot, color: "text-red-600" },
          { label: "Humans Verified", value: total > 0 ? Math.round((xgbHumans / total) * 100) + "%" : "0%", sub: "XGBoost results", icon: User, color: "text-green-600" },
          { label: "Avg Confidence", value: avgConf + "%", sub: "XGBoost model", icon: TrendingUp, color: "text-purple-600" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border bg-card p-5">
            <k.icon className={"h-6 w-6 mb-3 " + k.color} />
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-sm font-medium">{k.label}</p>
            <p className="text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* 7-day bar chart */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-5">
            <BarChart3 className="h-4 w-4 text-primary" /> Last 7 Days Activity
          </h3>
          {days.every(d => d.total === 0) ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No predictions in the last 7 days.</p>
          ) : (
            <>
              <div className="flex items-end gap-2" style={{ height: "120px" }}>
                {days.map((d) => (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-1" style={{ height: "120px", justifyContent: "flex-end" }}>
                    <div className="w-full flex flex-col gap-0.5" style={{ maxHeight: "108px", justifyContent: "flex-end" }}>
                      {d.bots > 0 && <div className="w-full rounded-sm bg-red-400/70 min-h-[3px]" style={{ height: Math.max(3, (d.bots / maxBar) * 90) + "px" }} />}
                      {(d.total - d.bots) > 0 && <div className="w-full rounded-sm bg-primary/60 min-h-[3px]" style={{ height: Math.max(3, ((d.total - d.bots) / maxBar) * 90) + "px" }} />}
                    </div>
                    <span className="text-xs text-muted-foreground">{d.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/60 inline-block" /> Humans</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-red-400/70 inline-block" /> Bots</span>
              </div>
            </>
          )}
        </div>

        {/* Model comparison */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-5">
            <Cpu className="h-4 w-4 text-primary" /> Model Bot Detection Comparison
          </h3>
          <div className="flex flex-col gap-5">
            {modelStats.map((m) => {
              const rate = m.bots + m.humans > 0 ? Math.round((m.bots / (m.bots + m.humans)) * 100) : 0
              return (
                <div key={m.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{m.name}</span>
                    <span className="font-bold">{rate}% bots</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className={"h-2 rounded-full " + m.color} style={{ width: rate + "%" }} />
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{m.bots} bot{m.bots !== 1 ? "s" : ""}</span>
                    <span>{m.humans} human{m.humans !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top users by submissions */}
      {byUser.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" /> Most Active Users
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                {["User", "Email", "Total Predictions", "Bots Found", "Bot Rate"].map(h => (
                  <th key={h} className="pb-2 pr-4 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byUser.map(([email, data]) => (
                <tr key={email} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="py-3 pr-4 font-medium">{data.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs">{email}</td>
                  <td className="py-3 pr-4">{data.total}</td>
                  <td className="py-3 pr-4 text-red-600 font-medium">{data.bots}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{data.total > 0 ? Math.round((data.bots / data.total) * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
