"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { authApi } from "./api"

interface User {
    id: string
    username: string
    role: "admin" | "basic"
    branch: string
    permissions: string[]
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (token: string, userData: User) => void
    logout: () => void
    hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (err) {
                console.error("Failed to parse stored user", err)
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            }
        }
        setLoading(false)
    }, [])

    const login = (token: string, userData: User) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    const hasPermission = (permission: string) => {
        if (!user) return false
        if (user.role === "admin") return true
        return user.permissions.includes(permission)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
