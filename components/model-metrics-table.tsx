"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown } from "lucide-react"

interface Model {
  name: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  auc_roc: number
  training_time: string
  color: string
}

interface ModelMetricsTableProps {
  models: Model[]
  bestModel: string
}

export function ModelMetricsTable({ models, bestModel }: ModelMetricsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Model</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Accuracy</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Precision</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Recall</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">F1 Score</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">AUC-ROC</th>
                <th className="pb-3 font-medium text-muted-foreground">Train Time</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr
                  key={model.name}
                  className={`border-b last:border-0 ${
                    model.name === bestModel ? "bg-accent/5" : ""
                  }`}
                >
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: model.color }}
                      />
                      {model.name}
                      {model.name === bestModel && (
                        <Crown className="h-4 w-4 text-accent" />
                      )}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-foreground">{model.accuracy}%</td>
                  <td className="py-3 pr-4 text-foreground">{model.precision}%</td>
                  <td className="py-3 pr-4 text-foreground">{model.recall}%</td>
                  <td className="py-3 pr-4 text-foreground">{model.f1_score}%</td>
                  <td className="py-3 pr-4 text-foreground">{model.auc_roc}%</td>
                  <td className="py-3 text-muted-foreground">{model.training_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
