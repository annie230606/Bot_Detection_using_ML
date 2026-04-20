"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  email: string
  name: string
  role: "user" | "admin"
  emailVerified: boolean
  createdAt: string
}

interface StoredUser extends User {
  password: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
  getAllUsers: () => StoredUser[]
  updateUser: (email: string, updates: Partial<StoredUser>) => boolean
  deleteUser: (email: string) => boolean
  verifyEmail: (email: string) => boolean
}

export const ADMIN_EMAIL = "admin@botdetect.ai"
export const ADMIN_PASSWORD = "Admin@1234"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function seedAdmin() {
  const usersRaw = localStorage.getItem("users")
  const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : []
  const exists = users.find((u) => u.email === ADMIN_EMAIL)
  if (!exists) {
    users.push({
      name: "Administrator",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      emailVerified: true,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("users", JSON.stringify(users))
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    seedAdmin()
    const stored = localStorage.getItem("session")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("session")
      }
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const usersRaw = localStorage.getItem("users")
    const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : []
    const found = users.find((u) => u.email === email && u.password === password)
    if (found) {
      const session: User = {
        email: found.email,
        name: found.name,
        role: found.role ?? "user",
        emailVerified: found.emailVerified ?? false,
        createdAt: found.createdAt ?? new Date().toISOString(),
      }
      setUser(session)
      localStorage.setItem("session", JSON.stringify(session))
      return true
    }
    return false
  }

  const register = (name: string, email: string, password: string): boolean => {
    const usersRaw = localStorage.getItem("users")
    const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : []
    if (users.find((u) => u.email === email)) return false
    const newUser: StoredUser = {
      name,
      email,
      password,
      role: "user",
      emailVerified: false,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    const session: User = { email, name, role: "user", emailVerified: false, createdAt: newUser.createdAt }
    setUser(session)
    localStorage.setItem("session", JSON.stringify(session))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("session")
  }

  const getAllUsers = (): StoredUser[] => {
    const usersRaw = localStorage.getItem("users")
    return usersRaw ? JSON.parse(usersRaw) : []
  }

  const updateUser = (email: string, updates: Partial<StoredUser>): boolean => {
    const usersRaw = localStorage.getItem("users")
    const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : []
    const idx = users.findIndex((u) => u.email === email)
    if (idx === -1) return false
    users[idx] = { ...users[idx], ...updates }
    localStorage.setItem("users", JSON.stringify(users))
    if (user?.email === email) {
      const updated: User = { email: users[idx].email, name: users[idx].name, role: users[idx].role, emailVerified: users[idx].emailVerified, createdAt: users[idx].createdAt }
      setUser(updated)
      localStorage.setItem("session", JSON.stringify(updated))
    }
    return true
  }

  const deleteUser = (email: string): boolean => {
    if (email === ADMIN_EMAIL) return false
    const usersRaw = localStorage.getItem("users")
    const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : []
    const filtered = users.filter((u) => u.email !== email)
    if (filtered.length === users.length) return false
    localStorage.setItem("users", JSON.stringify(filtered))
    return true
  }

  const verifyEmail = (email: string): boolean => {
    return updateUser(email, { emailVerified: true })
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAllUsers, updateUser, deleteUser, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
