"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, User, TrendingUp } from "lucide-react"

interface ModelResult {
  prediction: "BOT" | "HUMAN"
  confidence: number
  model: string
}

export interface PredictionResponse {
  svm: ModelResult
  random_forest: ModelResult
  xgboost: ModelResult
  features_received: Record<string, unknown>
  timestamp?: string
}

interface PredictionResultProps {
  data: PredictionResponse
}

const MODEL_COLORS: Record<string, string> = {
  SVM: "hsl(199, 89%, 48%)",
  "Random Forest": "hsl(168, 76%, 42%)",
  XGBoost: "hsl(24, 95%, 53%)",
}

function ModelCard({ result }: { result: ModelResult }) {
  const isBot = result.prediction === "BOT"
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-xl border p-5 ${
        isBot ? "border-destructive/30 bg-destructive/5" : "border-accent/30 bg-accent/5"
      }`}
    >
      {/* Model name tag */}
      <span
        className="rounded-full px-3 py-0.5 text-xs font-semibold text-primary-foreground"
        style={{ backgroundColor: MODEL_COLORS[result.model] }}
      >
        {result.model}
      </span>

      {/* Icon */}
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          isBot ? "bg-destructive/10" : "bg-accent/10"
        }`}
      >
        {isBot ? (
          <Bot className="h-8 w-8 text-destructive" />
        ) : (
          <User className="h-8 w-8 text-accent" />
        )}
      </div>

      {/* Label */}
      <p
        className={`text-2xl font-bold ${
          isBot ? "text-destructive" : "text-accent"
        }`}
      >
        {result.prediction}
      </p>

      {/* Confidence */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">{result.confidence}%</span>
        confidence
      </div>
    </div>
  )
}

export function PredictionResult({ data }: PredictionResultProps) {
  const models: ModelResult[] = [data.svm, data.random_forest, data.xgboost]
  const consensus = models.filter((m) => m.prediction === "BOT").length >= 2

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Prediction Results</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              consensus
                ? "bg-destructive/10 text-destructive"
                : "bg-accent/10 text-accent"
            }`}
          >
            {"Consensus: " + (consensus ? "BOT" : "HUMAN")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.model} result={m} />
          ))}
        </div>

        {/* Feature summary */}
        <div className="mt-6 rounded-lg bg-secondary p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Analyzed Features
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Username: </span>
              <span className="font-medium text-foreground">
                {String(data.features_received.username || "N/A")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Followers: </span>
              <span className="font-medium text-foreground">
                {String(data.features_received.follower_count)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Retweets: </span>
              <span className="font-medium text-foreground">
                {String(data.features_received.retweet_count)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Mentions: </span>
              <span className="font-medium text-foreground">
                {String(data.features_received.mention_count)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
