"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Database, Check } from "lucide-react"

interface DatasetColumn {
  name: string
  type: string
  description: string
}

interface DatasetColumnsTableProps {
  columns: DatasetColumn[]
  featuresUsed: string[]
}

export function DatasetColumnsTable({ columns, featuresUsed }: DatasetColumnsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5 text-primary" />
          Dataset Columns (bot_detection_dataset.csv)
        </CardTitle>
        <CardDescription>
          All 11 columns in the dataset. Features marked with a check are used for model training.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Column Name</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Data Type</th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">Description</th>
                <th className="pb-3 font-medium text-muted-foreground">Used in Model</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => {
                const isUsed =
                  featuresUsed.some((f) => f.includes(col.name)) ||
                  col.name === "Bot Label"
                return (
                  <tr key={col.name} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{col.name}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground">
                        {col.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{col.description}</td>
                    <td className="py-3">
                      {isUsed ? (
                        <span className="inline-flex items-center gap-1 text-accent">
                          <Check className="h-4 w-4" />
                          <span className="text-xs">
                            {col.name === "Bot Label" ? "Target" : "Feature"}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">---</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Features used summary */}
        <div className="mt-4 rounded-lg bg-secondary p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Engineered Features Used for Training
          </p>
          <div className="flex flex-wrap gap-2">
            {featuresUsed.map((f) => (
              <span
                key={f}
                className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-foreground"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
