"use client"

import { useState } from "react"
import { Settings, Save, Bell, Shield, Cpu, Globe, Key, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [toast, setToast] = useState("")
  const [settings, setSettings] = useState({
    siteName: "BotDetect",
    siteDescription: "Twitter Bot Detection System using ML models",
    defaultModel: "XGBoost",
    confidenceThreshold: "75",
    autoFlagThreshold: "90",
    requireEmailVerification: true,
    allowRegistration: true,
    maxPredictionsPerUser: "50",
    emailNotifications: true,
    adminAlerts: true,
    maintenanceMode: false,
    apiRateLimit: "100",
    sessionTimeout: "24",
    adminEmail: "admin@botdetect.ai",
  })

  const set = (key: string, value: string | boolean) => setSettings((prev) => ({ ...prev, [key]: value }))

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500) }

  const sections = [
    {
      title: "General Settings",
      icon: Globe,
      fields: [
        { label: "Site Name", key: "siteName", type: "text" },
        { label: "Site Description", key: "siteDescription", type: "text" },
        { label: "Admin Contact Email", key: "adminEmail", type: "email" },
      ],
    },
    {
      title: "Model Configuration",
      icon: Cpu,
      fields: [
        { label: "Default ML Model", key: "defaultModel", type: "select", options: ["XGBoost", "Random Forest", "SVM"] },
        { label: "Confidence Threshold (%)", key: "confidenceThreshold", type: "number", min: "50", max: "99" },
        { label: "Auto-Flag Threshold (%)", key: "autoFlagThreshold", type: "number", min: "50", max: "99" },
        { label: "Max Predictions Per User / Day", key: "maxPredictionsPerUser", type: "number", min: "1" },
      ],
    },
    {
      title: "Security & Access",
      icon: Shield,
      fields: [
        { label: "API Rate Limit (req/hour)", key: "apiRateLimit", type: "number", min: "1" },
        { label: "Session Timeout (hours)", key: "sessionTimeout", type: "number", min: "1", max: "168" },
      ],
      toggles: [
        { label: "Require Email Verification for New Users", key: "requireEmailVerification" },
        { label: "Allow Public Registration", key: "allowRegistration" },
        { label: "Maintenance Mode", key: "maintenanceMode" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      toggles: [
        { label: "Email Notifications for Admin Events", key: "emailNotifications" },
        { label: "Admin Alerts for High-Confidence Bot Detections", key: "adminAlerts" },
      ],
    },
  ]

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure platform behaviour and security options</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => showToast("Settings reset to defaults.")}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button size="sm" className="gap-2" onClick={() => showToast("Settings saved successfully.")}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-5">
              <section.icon className="h-4 w-4 text-primary" />
              {section.title}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields?.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={settings[field.key as keyof typeof settings] as string}
                      onChange={(e) => set(field.key, e.target.value)}
                    >
                      {field.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <Input
                      type={field.type}
                      value={settings[field.key as keyof typeof settings] as string}
                      onChange={(e) => set(field.key, e.target.value)}
                      min={(field as {min?: string}).min}
                      max={(field as {max?: string}).max}
                    />
                  )}
                </div>
              ))}
            </div>
            {section.toggles && (
              <div className={"flex flex-col gap-3 " + (section.fields?.length ? "mt-5 pt-5 border-t" : "")}>
                {section.toggles.map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">{toggle.label}</label>
                    <button
                      onClick={() => set(toggle.key, !settings[toggle.key as keyof typeof settings])}
                      className={"relative h-6 w-11 rounded-full transition-colors " + (settings[toggle.key as keyof typeof settings] ? "bg-primary" : "bg-muted")}
                    >
                      <span className={"absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform " + (settings[toggle.key as keyof typeof settings] ? "translate-x-5" : "translate-x-0")} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Admin Credentials Info */}
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4 text-yellow-700 dark:text-yellow-500">
            <Key className="h-4 w-4" /> Admin Credentials
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground mb-0.5">Admin Email</p>
              <p className="font-mono font-medium">admin@botdetect.ai</p>
            </div>
            <div className="rounded-lg border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground mb-0.5">Admin Password</p>
              <p className="font-mono font-medium">Admin@1234</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Change the admin password via User Management for production deployments.</p>
        </div>
      </div>
    </div>
  )
}
