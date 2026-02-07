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
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>
  }

  const monthlySalesData = stats?.monthlySalesData || []
  const employeePerformanceData = stats?.employeePerformanceData || []

  return (
    <div className="p-4 md:p-8 bg-linear-to-br from-background to-background/95 w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="text-primary" size={28} />
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">Welcome back! Here's your business overview</p>
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
        <div className="bg-card rounded-lg shadow-md p-4 md:p-6 border border-border overflow-x-auto">
          <h2 className="text-lg md:text-xl font-semibold text-card-foreground mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#142616" strokeWidth={2} name="Sales (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg shadow-md p-4 md:p-6 border border-border overflow-x-auto">
          <h2 className="text-lg md:text-xl font-semibold text-card-foreground mb-4">Employee-wise Tree Count</h2>
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
  )
}
