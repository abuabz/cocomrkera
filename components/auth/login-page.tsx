"use client"

import type React from "react"
import { useState } from "react"
import { User, Lock, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await authApi.login({ username, password })
            if (response.status === 'success') {
                login(response.token, response.user)
                toast({
                    title: "Sign-in Successful",
                    description: `Welcome back, ${response.user.username}!`,
                })
            } else {
                throw new Error(response.message || "Invalid credentials")
            }
        } catch (error: any) {
            toast({
                title: "Sign-in Failed",
                description: error.message || "Invalid username or password. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse shadow-2xl" />
            </div>

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-primary rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <img src="/Mr.kera icon.png" alt="MR. KERA Logo" className="relative w-24 h-24 object-contain drop-shadow-2xl" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-primary tracking-tight uppercase italic drop-shadow-sm">MR. KERA</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Management System</p>
                        </div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-card rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 border border-primary/5 backdrop-blur-sm">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-foreground tracking-tight underline decoration-primary decoration-4 underline-offset-8">SIGN IN</h2>
                        <p className="mt-4 text-sm text-muted-foreground font-medium uppercase tracking-wider">Enter your credentials to access the system</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-xs font-black text-primary uppercase tracking-widest ml-1">
                                Username
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-0 focus:border-primary/20 focus:bg-background transition-all duration-300 font-bold"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-black text-primary uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-0 focus:border-primary/20 focus:bg-background transition-all duration-300 font-bold"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-10 space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                        © 2026 MR. KERA MANAGEMENT SYSTEM
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className="h-1 w-8 bg-primary/20 rounded-full" />
                        <div className="h-1 w-8 bg-primary/40 rounded-full" />
                        <div className="h-1 w-8 bg-primary/20 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
