import { NextResponse } from "next/server"

/**
 * POST /api/predict
 *
 * Calls the local Flask Python backend to get predictions from
 * SVM, Random Forest, and XGBoost models.
 */
export async function POST(request: Request) {
  const body = await request.json()

  const {
    username = "",
    tweet = "",
    retweet_count = 0,
    mention_count = 0,
    follower_count = 0,
    verified = false,
    location = "",
    hashtags = "",
  } = body

  // Derived features expected by the models (computed just as before)
  const tweetLength = (tweet as string).length
  const hashtagCount = (hashtags as string)
    .split(",")
    .filter((h: string) => h.trim().length > 0).length
  const hasLocation = (location as string).trim().length > 0

  const processedData = {
    username,
    tweet,
    retweet_count,
    mention_count,
    follower_count,
    verified,
    location,
    hashtags,
    tweet_length: tweetLength,
    hashtag_count: hashtagCount,
    has_location: hasLocation,
  }

  try {
    // Call the Python backend running locally
    const backendRes = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(processedData),
    })

    if (!backendRes.ok) {
      throw new Error("Failed to communicate with python backend")
    }

    const backendData = await backendRes.json()

    // backendData should include svm, random_forest, xgboost and features_received
    // perfectly matching the shape expected by the frontend
    return NextResponse.json(backendData)
  } catch (error) {
    console.error("Error communicating with python backend:", error)
    return NextResponse.json({ error: "Failed to get predictions from models" }, { status: 500 })
  }
}
