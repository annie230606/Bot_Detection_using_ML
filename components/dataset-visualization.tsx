"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DatasetInfo {
  filename: string
  total_samples: number
  bot_samples: number
  human_samples: number
  train_test_split: string
  features_used: string[]
}

interface DatasetVisualizationProps {
  datasetInfo: DatasetInfo
}

const COLORS = ["#0ea5e9", "#2dd4a8"]

export function DatasetVisualization({ datasetInfo }: DatasetVisualizationProps) {
  const pieData = [
    { name: "Bot", value: datasetInfo.bot_samples },
    { name: "Human", value: datasetInfo.human_samples },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dataset Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Bot: { label: "Bot Accounts", color: COLORS[0] },
            Human: { label: "Human Accounts", color: COLORS[1] },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((_, index) => (
                  <Cell key={COLORS[index]} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Dataset File</p>
            <p className="text-sm font-bold text-foreground">{datasetInfo.filename}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Samples</p>
            <p className="text-lg font-bold text-foreground">
              {datasetInfo.total_samples.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Train/Test Split</p>
            <p className="text-lg font-bold text-foreground">{datasetInfo.train_test_split}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Bot Ratio</p>
            <p className="text-lg font-bold text-foreground">
              {Math.round(
                (datasetInfo.bot_samples / datasetInfo.total_samples) * 100
              )}
              %
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
