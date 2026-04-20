"use client"

import { useAuth } from "@/components/auth-context"
import { useEffect, useState } from "react"
import { Users, Trash2, MailCheck, UserCog, Search, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface StoredUser {
  email: string; name: string; role: "user" | "admin"
  emailVerified: boolean; createdAt: string; password: string
}

export default function UsersPage() {
  const { user, getAllUsers, updateUser, deleteUser, verifyEmail } = useAuth()
  const [users, setUsers] = useState<StoredUser[]>([])
  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState<StoredUser | null>(null)
  const [editName, setEditName] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [toast, setToast] = useState("")

  useEffect(() => { refresh() }, [])

  // Only show non-admin users
  const refresh = () => setUsers(getAllUsers().filter((u) => u.role !== "admin"))

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500) }

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg">{toast}</div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage registered user accounts and email verification</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Stats — only real users, no admins */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600" },
          { label: "Verified", value: users.filter(u => u.emailVerified).length, icon: CheckCircle2, color: "text-green-600" },
          { label: "Unverified", value: users.filter(u => !u.emailVerified).length, icon: XCircle, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card px-4 py-3 flex items-center gap-3">
            <s.icon className={"h-6 w-6 " + s.color} />
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2 text-sm"><Users className="h-4 w-4" /> Registered Users</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-56 h-8 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                {["User", "Email", "Email Verified", "Joined", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.email} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.emailVerified
                      ? <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
                      : <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><XCircle className="h-3.5 w-3.5" /> Unverified</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 px-2 gap-1 text-xs"
                        onClick={() => { setEditingUser(u); setEditName(u.name); setEditPassword("") }}>
                        <UserCog className="h-3.5 w-3.5" /> Edit
                      </Button>
                      {!u.emailVerified && (
                        <Button size="sm" variant="ghost" className="h-7 px-2 gap-1 text-xs text-green-600"
                          onClick={() => { verifyEmail(u.email); refresh(); showToast("Email verified for " + u.name) }}>
                          <MailCheck className="h-3.5 w-3.5" /> Verify Email
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive"
                        onClick={() => { if (confirm("Delete user " + u.email + "? This cannot be undone.")) { deleteUser(u.email); refresh(); showToast("User deleted.") } }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{search ? "No users match your search." : "No users have registered yet."}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-card shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><UserCog className="h-5 w-5" /> Edit User</h3>
            <p className="text-sm text-muted-foreground mb-5">{editingUser.email}</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  New Password <span className="text-muted-foreground font-normal text-xs">(leave blank to keep current)</span>
                </label>
                <Input type="password" placeholder="Enter new password..." value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button onClick={() => {
                  const updates: Record<string, string> = { name: editName }
                  if (editPassword.trim()) updates.password = editPassword.trim()
                  updateUser(editingUser.email, updates as never)
                  refresh(); setEditingUser(null); showToast("User updated successfully.")
                }}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
