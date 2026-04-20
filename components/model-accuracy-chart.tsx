"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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

interface ModelAccuracyChartProps {
  models: Model[]
}

export function ModelAccuracyChart({ models }: ModelAccuracyChartProps) {
  const chartData = models.map((m) => ({
    name: m.name,
    Accuracy: m.accuracy,
    Precision: m.precision,
    Recall: m.recall,
    "F1 Score": m.f1_score,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">All Metrics Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Accuracy: { label: "Accuracy", color: "#0ea5e9" },
            Precision: { label: "Precision", color: "#2dd4a8" },
            Recall: { label: "Recall", color: "#f97316" },
            "F1 Score": { label: "F1 Score", color: "#a855f7" },
          }}
          className="h-[320px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis domain={[80, 100]} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="Accuracy" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="Precision" fill="#2dd4a8" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="Recall" fill="#f97316" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="F1 Score" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
