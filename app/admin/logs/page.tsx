"use client"

import { useEffect, useState } from "react"
import { ScrollText, Search, Bot, User, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StoredPrediction {
  userEmail: string; userName: string; isoTimestamp: string
  svm: { prediction: string; confidence: number }
  random_forest: { prediction: string; confidence: number }
  xgboost: { prediction: string; confidence: number }
  features_received: { username?: string; follower_count?: number; retweet_count?: number; verified?: boolean; tweet?: string }
}

const PER_PAGE = 15

export default function LogsPage() {
  const [logs, setLogs] = useState<StoredPrediction[]>([])
  const [search, setSearch] = useState("")
  const [modelFilter, setModelFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")
  const [page, setPage] = useState(1)

  const load = () => {
    const preds: StoredPrediction[] = JSON.parse(localStorage.getItem("predictions") || "[]")
    setLogs(preds)
  }

  useEffect(() => { load() }, [])

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (l.features_received?.username || "").toLowerCase().includes(q) ||
      l.userEmail.toLowerCase().includes(q) ||
      l.userName.toLowerCase().includes(q)
    const modelResult = modelFilter === "xgboost" ? l.xgboost
      : modelFilter === "svm" ? l.svm
      : modelFilter === "random_forest" ? l.random_forest
      : l.xgboost
    const matchResult = resultFilter === "all" || modelResult.prediction === resultFilter
    return matchSearch && matchResult
  })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const getResult = (l: StoredPrediction) => modelFilter === "svm" ? l.svm : modelFilter === "random_forest" ? l.random_forest : l.xgboost

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bot Detection Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">Full audit trail of all prediction requests made by users</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Checks", value: logs.length, color: "text-blue-600" },
          { label: "Bots Detected", value: logs.filter(l => l.xgboost.prediction === "BOT").length, color: "text-red-600" },
          { label: "Humans Verified", value: logs.filter(l => l.xgboost.prediction === "HUMAN").length, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <p className={"text-2xl font-bold " + s.color}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search handle, user or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9 w-60 h-9 text-sm" />
        </div>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={modelFilter} onChange={(e) => { setModelFilter(e.target.value); setPage(1) }}>
          <option value="all">XGBoost (default)</option>
          <option value="xgboost">XGBoost</option>
          <option value="random_forest">Random Forest</option>
          <option value="svm">SVM</option>
        </select>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={resultFilter} onChange={(e) => { setResultFilter(e.target.value); setPage(1) }}>
          <option value="all">All Results</option>
          <option value="BOT">Bot</option>
          <option value="HUMAN">Human</option>
        </select>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {logs.length === 0 ? (
          <div className="py-16 text-center">
            <ScrollText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No predictions have been run yet. Logs will appear here once users make predictions on the dashboard.</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                  {["#", "Handle Checked", "Submitted By", "SVM", "Random Forest", "XGBoost", "Time"].map(h => (
                    <th key={h} className="px-4 py-3 font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((l, i) => {
                  const rowNum = (page - 1) * PER_PAGE + i + 1
                  const makeCell = (res: { prediction: string; confidence: number }) => (
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        {res.prediction === "BOT"
                          ? <Badge className="bg-red-500/10 text-red-600 border-red-200 gap-1 w-fit"><Bot className="h-3 w-3" />BOT</Badge>
                          : <Badge className="bg-green-500/10 text-green-600 border-green-200 gap-1 w-fit"><User className="h-3 w-3" />HUMAN</Badge>}
                        <span className="text-xs text-muted-foreground">{res.confidence}%</span>
                      </div>
                    </td>
                  )
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground text-xs">{rowNum}</td>
                      <td className="px-4 py-3 font-medium">{l.features_received?.username || "—"}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{l.userName}</p>
                        <p className="text-xs text-muted-foreground">{l.userEmail}</p>
                      </td>
                      {makeCell(l.svm)}
                      {makeCell(l.random_forest)}
                      {makeCell(l.xgboost)}
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(l.isoTimestamp).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1 text-xs disabled:opacity-40 hover:bg-muted transition-colors">Prev</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border px-3 py-1 text-xs disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
