"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfusionMatrix {
  tp: number
  fp: number
  fn: number
  tn: number
}

interface ConfusionMatrixDisplayProps {
  title: string
  matrix: ConfusionMatrix
  color: string
}

export function ConfusionMatrixDisplay({
  title,
  matrix,
  color,
}: ConfusionMatrixDisplayProps) {
  const total = matrix.tp + matrix.fp + matrix.fn + matrix.tn
  const accuracy = ((matrix.tp + matrix.tn) / total * 100).toFixed(1)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          {title}
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {accuracy}% acc
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mx-auto max-w-[220px]">
          {/* Header row */}
          <div className="mb-1 grid grid-cols-3 text-center text-xs text-muted-foreground">
            <div />
            <div className="font-medium">Pred Bot</div>
            <div className="font-medium">Pred Human</div>
          </div>

          {/* Actual Bot row */}
          <div className="mb-1 grid grid-cols-3 items-center gap-1 text-center text-sm">
            <div className="text-xs font-medium text-muted-foreground text-right pr-2">
              Actual Bot
            </div>
            <div className="rounded-md bg-accent/15 py-2 font-bold text-accent">
              {matrix.tp}
              <div className="text-[10px] font-normal text-muted-foreground">TP</div>
            </div>
            <div className="rounded-md bg-destructive/10 py-2 font-bold text-destructive">
              {matrix.fn}
              <div className="text-[10px] font-normal text-muted-foreground">FN</div>
            </div>
          </div>

          {/* Actual Human row */}
          <div className="grid grid-cols-3 items-center gap-1 text-center text-sm">
            <div className="text-xs font-medium text-muted-foreground text-right pr-2">
              Actual Human
            </div>
            <div className="rounded-md bg-destructive/10 py-2 font-bold text-destructive">
              {matrix.fp}
              <div className="text-[10px] font-normal text-muted-foreground">FP</div>
            </div>
            <div className="rounded-md bg-accent/15 py-2 font-bold text-accent">
              {matrix.tn}
              <div className="text-[10px] font-normal text-muted-foreground">TN</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
