import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Bot,
  Shield,
  BarChart3,
  Zap,
  Database,
  BrainCircuit,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: BrainCircuit,
    title: "3-Model Comparison",
    description:
      "SVM, Random Forest, and XGBoost trained on bot_detection_dataset.csv. Each prediction shows all three models side by side with confidence scores.",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    description:
      "Compare accuracy, precision, recall, F1, and AUC-ROC. View confusion matrices, feature importance charts, and dataset column breakdowns.",
  },
  {
    icon: Shield,
    title: "Real-time Detection",
    description:
      "Enter tweet data (username, tweet text, retweet count, mention count, follower count, verified status, hashtags) and get instant predictions.",
  },
  {
    icon: Database,
    title: "Real Dataset Columns",
    description:
      "Built around 11 real columns: User ID, Username, Tweet, Retweet Count, Mention Count, Follower Count, Verified, Bot Label, Location, Created At, Hashtags.",
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Bot className="h-4 w-4 text-primary" />
              Machine Learning Project
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Twitter Bot{" "}
              <span className="text-primary">Detection</span>{" "}
              System
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Leveraging the power of SVM, Random Forest, and XGBoost to identify
              automated bot accounts on Twitter. Analyze user features and get
              instant predictions with confidence scores.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Try Prediction
                </Button>
              </Link>
              <Link href="/models">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  <BarChart3 className="h-5 w-5" />
                  Compare Models
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
              The Problem
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Twitter bots manipulate public opinion, spread misinformation, and
              inflate engagement metrics. Identifying these automated accounts is
              critical for maintaining the integrity of online discourse. Our system
              uses supervised machine learning to classify accounts based on
              behavioral and profile features.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            Key Features
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to Detect Bots?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Enter Twitter user features and get an instant ML-powered prediction.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
