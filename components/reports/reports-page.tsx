"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Download } from "lucide-react"

const customerSalesData = [
  { name: "Rajesh Kumar", sales: 50000 },
  { name: "Priya Singh", sales: 35000 },
  { name: "Amit Patel", sales: 28000 },
  { name: "Deepak Verma", sales: 22000 },
  { name: "Neha Sharma", sales: 18000 },
]

const employeeTreeData = [
  { name: "Priya Singh", value: 1200 },
  { name: "Amit Patel", value: 1000 },
  { name: "Deepak Verma", value: 900 },
  { name: "Neha Sharma", value: 750 },
  { name: "Ravi Kumar", value: 650 },
]

const COLORS = ["#142616", "#6F2D00", "#8B4513", "#A0522D", "#CD853F"]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: new Date().toISOString().split("T")[0],
  })

  const handleExport = (format: "pdf" | "excel") => {
    alert(`Exporting ${format.toUpperCase()} report...`)
  }

  return (
    <div className="p-8 bg-gradient-to-br from-background to-background/95">
      <h1 className="text-4xl font-bold text-foreground mb-8">Reports & Analytics</h1>

      {/* Date Range Filter */}
      <div className="bg-card rounded-lg shadow-md p-6 border border-border mb-8">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Filter by Date Range</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleExport("pdf")}
              className="bg-destructive hover:bg-destructive/90 text-white gap-2"
            >
              <Download size={18} /> PDF
            </Button>
            <Button
              onClick={() => handleExport("excel")}
              className="bg-secondary hover:bg-secondary/90 text-white gap-2"
            >
              <Download size={18} /> Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Customer-wise Sales Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Customer-wise Sales Report</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="sales" fill="#142616" name="Sales Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employee-wise Tree Count Report */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Employee-wise Tree Count Report</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employeeTreeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {employeeTreeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} trees`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Sales Revenue</h3>
          <p className="text-3xl font-bold text-primary">₹1,53,000</p>
          <p className="text-xs text-muted-foreground mt-1">In selected date range</p>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Trees Plucked</h3>
          <p className="text-3xl font-bold text-secondary">5,500</p>
          <p className="text-xs text-muted-foreground mt-1">In selected date range</p>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Sale Value</h3>
          <p className="text-3xl font-bold text-primary">₹30,600</p>
          <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
        </div>
      </div>
    </div>
  )
}
