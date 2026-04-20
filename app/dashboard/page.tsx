"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { PredictionForm } from "@/components/prediction-form"
import { PredictionResult } from "@/components/prediction-result"
import type { PredictionResponse } from "@/components/prediction-result"
import { PredictionHistory } from "@/components/prediction-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user } = useAuth()
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [history, setHistory] = useState<PredictionResponse[]>([])
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 inline-flex rounded-xl bg-primary/10 p-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the prediction dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login"><Button className="w-full">Sign In to Continue</Button></Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePredict = async (features: Record<string, unknown>) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
      })
      const data: PredictionResponse = await res.json()
      const entry: PredictionResponse = {
        ...data,
        timestamp: new Date().toLocaleString(),
      }
      setResult(entry)
      setHistory((prev) => [entry, ...prev])

      // Persist to localStorage for admin to see
      const existing = JSON.parse(localStorage.getItem("predictions") || "[]")
      const stored = {
        ...entry,
        userEmail: user.email,
        userName: user.name,
        isoTimestamp: new Date().toISOString(),
      }
      localStorage.setItem("predictions", JSON.stringify([stored, ...existing]))
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Prediction Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          {"Welcome back, " + user.name + ". Enter tweet data to compare SVM, Random Forest & XGBoost predictions."}
        </p>
      </div>

      <div className="mb-8 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="text-sm font-medium text-foreground">Ethical Use Notice</p>
          <p className="text-sm text-muted-foreground">
            This tool is designed for research and educational purposes. Always respect privacy and platform terms of service when analyzing accounts.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        </div>
        <div className="lg:col-span-3">
          {result ? (
            <PredictionResult data={result} />
          ) : (
            <Card className="flex min-h-[380px] items-center justify-center">
              <div className="text-center">
                <Bot className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">Submit tweet data to compare predictions from all 3 models</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-10">
          <PredictionHistory history={history} />
        </div>
      )}
    </div>
  )
}
