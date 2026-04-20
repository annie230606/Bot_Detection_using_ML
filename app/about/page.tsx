import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Database,
  BrainCircuit,
  BarChart3,
  Globe,
  FileText,
  Users,
  Workflow,
  Shield,
  ArrowRight,
} from "lucide-react"

const datasetColumns = [
  { name: "User ID", description: "Unique identifier for each user in the dataset" },
  { name: "Username", description: "The username associated with the user" },
  { name: "Tweet", description: "The text content of the tweet" },
  { name: "Retweet Count", description: "The number of times the tweet has been retweeted" },
  { name: "Mention Count", description: "The number of mentions in the tweet" },
  { name: "Follower Count", description: "The number of followers the user has" },
  { name: "Verified", description: "Whether the user is verified or not (boolean)" },
  { name: "Bot Label", description: "Target label: 1 = Bot, 0 = Human" },
  { name: "Location", description: "The location associated with the user" },
  { name: "Created At", description: "The date and time when the tweet was created" },
  { name: "Hashtags", description: "The hashtags associated with the tweet" },
]

const workflowSteps = [
  {
    icon: Database,
    title: "1. Data Collection",
    description:
      "Loaded bot_detection_dataset.csv containing 10,847 labeled Twitter accounts with 11 columns: User ID, Username, Tweet, Retweet Count, Mention Count, Follower Count, Verified, Bot Label, Location, Created At, and Hashtags.",
  },
  {
    icon: FileText,
    title: "2. Data Preprocessing",
    description:
      "Cleaned missing values in Location and Hashtags fields. Encoded Verified as binary. Derived new features: Tweet Length, Hashtag Count, and Has Location. Applied StandardScaler to numerical features. Split data 80/20 for training and testing.",
  },
  {
    icon: BrainCircuit,
    title: "3. Model Training",
    description:
      "Trained three supervised ML classifiers: SVM (with RBF kernel), Random Forest (100 estimators), and XGBoost (learning rate 0.1, max depth 6). Applied GridSearchCV for hyperparameter tuning on each model.",
  },
  {
    icon: BarChart3,
    title: "4. Evaluation & Comparison",
    description:
      "Evaluated all three models using Accuracy, Precision, Recall, F1 Score, and AUC-ROC. Generated confusion matrices and feature importance rankings. Random Forest achieved the best overall performance at 94.8% accuracy.",
  },
  {
    icon: Globe,
    title: "5. Deployment",
    description:
      "Deployed all three models via a REST API. The Next.js frontend sends tweet features and receives predictions from SVM, Random Forest, and XGBoost simultaneously for side-by-side comparison.",
  },
]

const teamMembers = [
  {
    name: "Team Member 1",
    role: "ML Engineer",
    description: "Model training, hyperparameter tuning, and evaluation pipeline.",
  },
  {
    name: "Team Member 2",
    role: "Data Engineer",
    description: "Data collection, preprocessing, and feature engineering.",
  },
  {
    name: "Team Member 3",
    role: "Full-Stack Developer",
    description: "Frontend development, API integration, and deployment.",
  },
  {
    name: "Team Member 4",
    role: "Research Analyst",
    description: "Literature review, documentation, and performance analysis.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          About the Project
        </h1>
        <p className="mt-1 text-muted-foreground">
          Twitter Bot Detection using Machine Learning &mdash; Final Year Project
        </p>
      </div>

      {/* Dataset Details */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-foreground">Dataset Information</h2>
        <Card>
          <CardContent className="py-6">
            <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Name</p>
                <p className="mt-1 font-mono text-sm text-foreground">
                  bot_detection_dataset.csv
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Samples</p>
                <p className="mt-1 text-foreground">10,847 labeled accounts</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Class Distribution</p>
                <p className="mt-1 text-foreground">5,438 Bots / 5,409 Humans</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Columns</p>
                <p className="mt-1 text-foreground">11 columns</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Train/Test Split</p>
                <p className="mt-1 text-foreground">80% Training / 20% Testing</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preprocessing</p>
                <p className="mt-1 text-foreground">
                  StandardScaler, Label Encoding, Null handling
                </p>
              </div>
            </div>

            {/* Column breakdown */}
            <div className="rounded-lg border bg-secondary/50 p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">
                Dataset Columns
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {datasetColumns.map((col) => (
                  <div key={col.name} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <div>
                      <span className="font-medium text-foreground">{col.name}</span>
                      <span className="text-muted-foreground">{" - " + col.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ML Workflow */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-foreground">ML Workflow</h2>
        <div className="flex flex-col gap-4">
          {workflowSteps.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                {i < workflowSteps.length - 1 && (
                  <div className="mt-2 h-full w-px bg-border" />
                )}
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Architecture */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-foreground">System Architecture</h2>
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="rounded-lg border bg-secondary p-4 text-center">
                <Globe className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-foreground">Next.js Frontend</p>
                <p className="text-xs text-muted-foreground">React + Tailwind CSS</p>
              </div>
              <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" />
              <div className="rounded-lg border bg-secondary p-4 text-center">
                <Workflow className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-foreground">API Layer</p>
                <p className="text-xs text-muted-foreground">Route Handlers</p>
              </div>
              <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" />
              <div className="rounded-lg border bg-secondary p-4 text-center">
                <BrainCircuit className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-foreground">ML Models</p>
                <p className="text-xs text-muted-foreground">SVM, RF, XGBoost</p>
              </div>
              <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" />
              <div className="rounded-lg border bg-secondary p-4 text-center">
                <Database className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-foreground">Dataset</p>
                <p className="text-xs text-muted-foreground">bot_detection_dataset.csv</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Model Summary */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-foreground">Model Summary</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="mb-2 h-2 w-12 rounded-full" style={{ backgroundColor: "hsl(199, 89%, 48%)" }} />
              <CardTitle className="text-base">SVM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Support Vector Machine with RBF kernel. Good at finding the optimal hyperplane for binary classification. Accuracy: 85.6%.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="mb-2 h-2 w-12 rounded-full" style={{ backgroundColor: "hsl(168, 76%, 42%)" }} />
              <CardTitle className="text-base">Random Forest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ensemble of 100 decision trees with bootstrap aggregation. Best performer -- robust against overfitting with built-in feature importance. Accuracy: 94.8%.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="mb-2 h-2 w-12 rounded-full" style={{ backgroundColor: "hsl(24, 95%, 53%)" }} />
              <CardTitle className="text-base">XGBoost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gradient-boosted trees with learning rate 0.1 and max depth 6. Strong performer with regularization to prevent overfitting. Accuracy: 91.3%.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ethical Use */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-foreground">Ethical Use & Security</h2>
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="py-6">
            <div className="flex gap-4">
              <Shield className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed text-foreground">
                  This bot detection system is built strictly for educational and research
                  purposes. It should not be used to harass, target, or discriminate
                  against any individual or group.
                </p>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Predictions are probabilistic and may contain false positives/negatives.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Always respect platform terms of service and user privacy.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Model outputs should be treated as one signal, not a definitive classification.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Team Members */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-foreground">Team Members</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <Card key={member.name}>
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base">{member.name}</CardTitle>
                <p className="text-sm text-primary">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
