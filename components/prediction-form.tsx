"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap } from "lucide-react"

interface PredictionFormProps {
  onSubmit: (features: Record<string, unknown>) => void
  loading: boolean
}

export function PredictionForm({ onSubmit, loading }: PredictionFormProps) {
  const [username, setUsername] = useState("bot_user_42")
  const [tweet, setTweet] = useState("Check out this amazing deal! Click the link now!!! #free #win #prize")
  const [retweetCount, setRetweetCount] = useState("85")
  const [mentionCount, setMentionCount] = useState("7")
  const [followerCount, setFollowerCount] = useState("23")
  const [verified, setVerified] = useState(false)
  const [location, setLocation] = useState("")
  const [hashtags, setHashtags] = useState("#free, #win, #prize")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      username,
      tweet,
      retweet_count: Number(retweetCount),
      mention_count: Number(mentionCount),
      follower_count: Number(followerCount),
      verified,
      location,
      hashtags,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Enter Tweet Features</CardTitle>
        <CardDescription>
          Fill in the fields from the dataset to get predictions from all 3 models.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="e.g. bot_user_42"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tweet">Tweet Text</Label>
            <textarea
              id="tweet"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter tweet content..."
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="retweet_count">Retweet Count</Label>
              <Input
                id="retweet_count"
                type="number"
                min="0"
                value={retweetCount}
                onChange={(e) => setRetweetCount(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mention_count">Mention Count</Label>
              <Input
                id="mention_count"
                type="number"
                min="0"
                value={mentionCount}
                onChange={(e) => setMentionCount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="follower_count">Follower Count</Label>
            <Input
              id="follower_count"
              type="number"
              min="0"
              value={followerCount}
              onChange={(e) => setFollowerCount(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g. New York, USA (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              type="text"
              placeholder="e.g. #bot, #spam, #fake"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm" htmlFor="verified-toggle">
              <input
                id="verified-toggle"
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Verified Account
            </label>
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Running 3 Models...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Predict with All Models
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
