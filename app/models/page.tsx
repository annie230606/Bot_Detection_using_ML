"use client"

import useSWR from "swr"
import { ModelMetricsTable } from "@/components/model-metrics-table"
import { ModelAccuracyChart } from "@/components/model-accuracy-chart"
import { DatasetVisualization } from "@/components/dataset-visualization"
import { FeatureImportanceChart } from "@/components/feature-importance-chart"
import { ConfusionMatrixDisplay } from "@/components/confusion-matrix"
import { DatasetColumnsTable } from "@/components/dataset-columns-table"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface ModelMetric {
  name: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  auc_roc: number
  training_time: string
  color: string
}

interface DatasetColumn {
  name: string
  type: string
  description: string
}

interface FeatureImportance {
  feature: string
  importance: number
}

interface ConfusionMatrix {
  tp: number
  fp: number
  fn: number
  tn: number
}

interface MetricsData {
  models: ModelMetric[]
  dataset_info: {
    filename: string
    total_samples: number
    bot_samples: number
    human_samples: number
    train_test_split: string
    columns: DatasetColumn[]
    features_used: string[]
  }
  feature_importance: {
    random_forest: FeatureImportance[]
    xgboost: FeatureImportance[]
  }
  confusion_matrix: {
    svm: ConfusionMatrix
    random_forest: ConfusionMatrix
    xgboost: ConfusionMatrix
  }
}

export default function ModelsPage() {
  const { data, isLoading } = useSWR<MetricsData>("/api/model-metrics", fetcher)

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading model metrics...</p>
        </div>
      </div>
    )
  }

  const bestModel = data.models.reduce((best, m) =>
    m.accuracy > best.accuracy ? m : best
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Model Comparison
        </h1>
        <p className="mt-1 text-muted-foreground">
          Performance analysis of SVM, Random Forest, and XGBoost on the bot_detection_dataset.csv.
        </p>
      </div>

      {/* Best Model Banner */}
      <Card className="mb-8 border-accent/30 bg-accent/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="rounded-lg bg-accent/10 p-2.5">
            <Trophy className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Best Performing Model</p>
            <p className="text-lg font-bold text-foreground">
              {bestModel.name}{" "}
              <span className="text-accent">
                {"(" + bestModel.accuracy + "% accuracy, AUC-ROC: " + bestModel.auc_roc + "%)"}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Table */}
      <div className="mb-8">
        <ModelMetricsTable models={data.models} bestModel={bestModel.name} />
      </div>

      {/* Charts Row 1: Accuracy + Dataset Distribution */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <ModelAccuracyChart models={data.models} />
        <DatasetVisualization datasetInfo={data.dataset_info} />
      </div>

      {/* Dataset Columns */}
      <div className="mb-8">
        <DatasetColumnsTable columns={data.dataset_info.columns} featuresUsed={data.dataset_info.features_used} />
      </div>

      {/* Feature Importance */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <FeatureImportanceChart
          title="Random Forest - Feature Importance"
          data={data.feature_importance.random_forest}
          color="hsl(168, 76%, 42%)"
        />
        <FeatureImportanceChart
          title="XGBoost - Feature Importance"
          data={data.feature_importance.xgboost}
          color="hsl(24, 95%, 53%)"
        />
      </div>

      {/* Confusion Matrices */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-foreground">Confusion Matrices</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <ConfusionMatrixDisplay
            title="SVM"
            matrix={data.confusion_matrix.svm}
            color="hsl(199, 89%, 48%)"
          />
          <ConfusionMatrixDisplay
            title="Random Forest"
            matrix={data.confusion_matrix.random_forest}
            color="hsl(168, 76%, 42%)"
          />
          <ConfusionMatrixDisplay
            title="XGBoost"
            matrix={data.confusion_matrix.xgboost}
            color="hsl(24, 95%, 53%)"
          />
        </div>
      </div>
    </div>
  )
}
