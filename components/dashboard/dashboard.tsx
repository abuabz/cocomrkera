"use client"

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

const monthlyData = [
  { month: "Jan", sales: 4000, trees: 2400 },
  { month: "Feb", sales: 3000, trees: 1398 },
  { month: "Mar", sales: 2000, trees: 9800 },
  { month: "Apr", sales: 2780, trees: 3908 },
  { month: "May", sales: 1890, trees: 4800 },
  { month: "Jun", sales: 2390, trees: 3800 },
]

const employeeData = [
  { name: "Rajesh Kumar", trees: 1200 },
  { name: "Priya Singh", trees: 1000 },
  { name: "Amit Patel", trees: 900 },
  { name: "Deepak Verma", trees: 750 },
  { name: "Neha Sharma", trees: 650 },
]

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-background to-background/95 w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="text-primary" size={28} />
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">Welcome back! Here's your business overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <SummaryCard title="Total Customers" value="248" icon="users" trend="+12%" color="primary" />
        <SummaryCard title="Total Employees" value="32" icon="users-check" trend="+2%" color="primary" />
        <SummaryCard title="Total Sales" value="₹8.5L" icon="trending-up" trend="+8%" color="primary" />
        <SummaryCard title="Trees Plucked (Month)" value="12,450" icon="leaf" trend="+15%" color="secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card rounded-lg shadow-md p-4 md:p-6 border border-border overflow-x-auto">
          <h2 className="text-lg md:text-xl font-semibold text-card-foreground mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
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
            <BarChart data={employeeData}>
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
