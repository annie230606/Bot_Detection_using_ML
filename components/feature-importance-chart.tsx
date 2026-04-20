"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface FeatureImportance {
  feature: string
  importance: number
}

interface FeatureImportanceChartProps {
  title: string
  data: FeatureImportance[]
  color: string
}

export function FeatureImportanceChart({
  title,
  data,
  color,
}: FeatureImportanceChartProps) {
  const chartData = data
    .sort((a, b) => b.importance - a.importance)
    .map((d) => ({
      feature: d.feature,
      importance: Math.round(d.importance * 100),
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            importance: { label: "Importance %", color },
          }}
          className="h-[280px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 35]} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="feature"
                type="category"
                width={100}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="importance"
                fill={color}
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
