"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History, Bot, User } from "lucide-react"
import type { PredictionResponse } from "@/components/prediction-result"

interface PredictionHistoryProps {
  history: PredictionResponse[]
}

function Badge({ prediction }: { prediction: "BOT" | "HUMAN" }) {
  const isBot = prediction === "BOT"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        isBot ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"
      }`}
    >
      {isBot ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
      {prediction}
    </span>
  )
}

export function PredictionHistory({ history }: PredictionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-primary" />
          Prediction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Time</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Username</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">SVM</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Random Forest</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">XGBoost</th>
                <th className="pb-3 font-medium text-muted-foreground">Followers</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => {
                const features = item.features_received
                return (
                  <tr key={`${item.timestamp}-${i}`} className="border-b last:border-0">
                    <td className="py-3 pr-4 text-muted-foreground">
                      {item.timestamp}
                    </td>
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {String(features.username || "N/A")}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-0.5">
                        <Badge prediction={item.svm.prediction} />
                        <span className="text-xs text-muted-foreground">
                          {item.svm.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-0.5">
                        <Badge prediction={item.random_forest.prediction} />
                        <span className="text-xs text-muted-foreground">
                          {item.random_forest.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-0.5">
                        <Badge prediction={item.xgboost.prediction} />
                        <span className="text-xs text-muted-foreground">
                          {item.xgboost.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {String(features.follower_count ?? "---")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
