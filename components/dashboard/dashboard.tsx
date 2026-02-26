"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import SummaryCard from "./summary-card"
import { TrendingUp } from "lucide-react"
import { statsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await statsApi.getDashboard()
      setStats(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch dashboard stats",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-background min-h-screen w-full">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-6 md:mb-8 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full bg-primary/10" />
            <div>
              <Skeleton className="h-8 w-64 mb-2 bg-primary/10" />
              <Skeleton className="h-4 w-40 bg-muted" />
            </div>
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-primary/5 p-5 md:p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-12 w-24 bg-primary/5" />
                  <Skeleton className="h-12 w-12 rounded-full bg-primary/5" />
                </div>
                <Skeleton className="h-4 w-32 bg-muted/50" />
                <Skeleton className="h-4 w-16 bg-muted/30" />
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-primary/5 p-5 md:p-6">
              <Skeleton className="h-6 w-48 mb-6 bg-primary/10" />
              <div className="h-[300px] flex items-end justify-between gap-2 pb-4">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="w-full bg-primary/5" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-primary/5 p-5 md:p-6">
              <Skeleton className="h-6 w-48 mb-6 bg-primary/10" />
              <div className="h-[300px] flex items-center justify-center">
                <div className="relative flex items-center justify-center w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-primary/20 animate-spin" />
                  </div>
                  <Skeleton className="h-full w-full rounded-full bg-primary/5 shrink-0 opacity-50 scale-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const monthlySalesData = stats?.monthlySalesData || []
  const employeePerformanceData = stats?.employeePerformanceData || []

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight flex items-center gap-3">
            <TrendingUp className="text-secondary" size={32} />
            Business Intelligence
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 font-bold opacity-70 uppercase tracking-widest">Analytics Dashboard • Live Overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <SummaryCard
            title="Total Customers"
            value={stats?.customerCount?.toString() || "0"}
            icon="users"
            trend="+0%"
            color="primary"
          />
          <SummaryCard
            title="Total Employees"
            value={stats?.employeeCount?.toString() || "0"}
            icon="users-check"
            trend="+0%"
            color="primary"
          />
          <SummaryCard
            title="Total Sales"
            value={`₹${(stats?.totalSalesAmount / 100000).toFixed(1)}L`}
            icon="trending-up"
            trend="+0%"
            color="primary"
          />
          <SummaryCard
            title="Trees Plucked (Month)"
            value={stats?.totalTreesMonth?.toLocaleString() || "0"}
            icon="leaf"
            trend="+0%"
            color="secondary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 border border-primary/5 overflow-x-auto">
            <h2 className="text-lg md:text-xl font-black text-primary mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-secondary" />
              Monthly Sales Growth
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#142616" opacity={0.05} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="top" align="right" />
                <Line type="monotone" dataKey="sales" stroke="#142616" strokeWidth={4} dot={{ r: 6, fill: '#6F2D00' }} name="Gross Sales (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-lg shadow-md p-4 md:p-5 border border-border overflow-x-auto">
            <h2 className="text-base md:text-lg font-semibold text-card-foreground mb-4">Employee-wise Tree Count</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trees" fill="#6F2D00" name="Trees Plucked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
