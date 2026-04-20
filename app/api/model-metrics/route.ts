import { NextResponse } from "next/server"

/**
 * GET /api/model-metrics
 *
 * Returns model performance metrics and dataset column info
 * aligned with the bot_detection_dataset.csv schema.
 *
 * Replace with real metrics from your training pipeline.
 */
export async function GET() {
  const metrics = {
    models: [
      {
        name: "SVM",
        accuracy: 85.6,
        precision: 84.3,
        recall: 83.9,
        f1_score: 84.1,
        auc_roc: 89.7,
        training_time: "14.2s",
        color: "hsl(199, 89%, 48%)",
      },
      {
        name: "Random Forest",
        accuracy: 94.8,
        precision: 94.2,
        recall: 95.1,
        f1_score: 94.6,
        auc_roc: 98.1,
        training_time: "7.9s",
        color: "hsl(168, 76%, 42%)",
      },
      {
        name: "XGBoost",
        accuracy: 91.3,
        precision: 90.5,
        recall: 91.0,
        f1_score: 90.7,
        auc_roc: 95.2,
        training_time: "6.1s",
        color: "hsl(24, 95%, 53%)",
      },
    ],
    dataset_info: {
      filename: "bot_detection_dataset.csv",
      total_samples: 10847,
      bot_samples: 5438,
      human_samples: 5409,
      train_test_split: "80/20",
      columns: [
        { name: "User ID", type: "int", description: "Unique identifier for each user" },
        { name: "Username", type: "string", description: "The username of the user" },
        { name: "Tweet", type: "string", description: "Text content of the tweet" },
        { name: "Retweet Count", type: "int", description: "Number of retweets" },
        { name: "Mention Count", type: "int", description: "Number of mentions in the tweet" },
        { name: "Follower Count", type: "int", description: "Number of followers" },
        { name: "Verified", type: "boolean", description: "Whether the user is verified" },
        { name: "Bot Label", type: "int", description: "1 = Bot, 0 = Human (target)" },
        { name: "Location", type: "string", description: "User location" },
        { name: "Created At", type: "datetime", description: "Tweet creation timestamp" },
        { name: "Hashtags", type: "string", description: "Hashtags in the tweet" },
      ],
      features_used: [
        "Retweet Count",
        "Mention Count",
        "Follower Count",
        "Verified",
        "Tweet Length (derived)",
        "Hashtag Count (derived)",
        "Has Location (derived)",
      ],
    },
    feature_importance: {
      random_forest: [
        { feature: "Follower Count", importance: 0.28 },
        { feature: "Retweet Count", importance: 0.19 },
        { feature: "Mention Count", importance: 0.16 },
        { feature: "Tweet Length", importance: 0.12 },
        { feature: "Verified", importance: 0.10 },
        { feature: "Hashtag Count", importance: 0.09 },
        { feature: "Has Location", importance: 0.06 },
      ],
      xgboost: [
        { feature: "Follower Count", importance: 0.31 },
        { feature: "Verified", importance: 0.18 },
        { feature: "Retweet Count", importance: 0.16 },
        { feature: "Mention Count", importance: 0.13 },
        { feature: "Tweet Length", importance: 0.10 },
        { feature: "Hashtag Count", importance: 0.07 },
        { feature: "Has Location", importance: 0.05 },
      ],
    },
    confusion_matrix: {
      svm: { tp: 892, fp: 162, fn: 152, tn: 963 },
      random_forest: { tp: 1032, fp: 58, fn: 48, tn: 1031 },
      xgboost: { tp: 978, fp: 96, fn: 93, tn: 1002 },
    },
  }

  return NextResponse.json(metrics)
}
