"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Download, Printer } from "lucide-react"
import { statsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const COLORS = ["#142616", "#6F2D00", "#8B4513", "#A0522D", "#CD853F", "#556B2F", "#D2691E", "#3CB371"]

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })
  const { toast } = useToast()

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await statsApi.getReports(dateRange.from, dateRange.to)
      setData(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [dateRange])

  const handleExport = (format: "pdf" | "excel") => {
    toast({
      title: "Export Started",
      description: `Your ${format.toUpperCase()} report is being generated.`,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen print:bg-white print:p-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 print:hidden">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Analytics & Reports</h1>

      </div>

      {/* Date Filter */}
      <div className="bg-card rounded-xl shadow-md p-6 border border-border mb-8">
        <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4">Analysis Period</h2>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground font-medium focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground font-medium focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-40 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground font-bold animate-pulse">Gathering statistics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-card rounded-xl shadow-md p-6 border border-border">
              <h2 className="text-xl font-black text-card-foreground mb-6">Customer Sales Distribution</h2>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.customerSalesData || []} margin={{ bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} fontWeight="bold" />
                    <YAxis fontSize={10} fontWeight="bold" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    <Bar dataKey="sales" fill="#142616" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-md p-6 border border-border">
              <h2 className="text-xl font-black text-card-foreground mb-6">Worker Yield (Trees Handled)</h2>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.employeeTreeData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {(data?.employeeTreeData || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()} trees`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Fixed Metrics Cards - No Overlapping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl shadow-md p-6 border border-border flex flex-col justify-between min-h-[140px]">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 text-center">Total Revenue</p>
              <div className="flex items-center justify-center gap-1 overflow-hidden">
                <span className="text-lg font-bold text-primary">₹</span>
                <span className="text-2xl font-black text-foreground truncate" title={data?.summary?.totalRevenue?.toLocaleString()}>
                  {data?.summary?.totalRevenue?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-full" />
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-md p-6 border border-border flex flex-col justify-between min-h-[140px]">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 text-center">Trees Plucked</p>
              <div className="flex items-center justify-center gap-2 overflow-hidden">
                <span className="text-2xl font-black text-foreground">
                  {data?.summary?.totalTrees?.toLocaleString() || "0"}
                </span>
                <span className="text-[10px] font-black text-muted-foreground uppercase">Units</span>
              </div>
              <div className="mt-4 h-1 w-full bg-secondary/10 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-full" />
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-md p-6 border border-border flex flex-col justify-between min-h-[140px]">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 text-center">Avg Sale Value</p>
              <div className="flex items-center justify-center gap-1 overflow-hidden">
                <span className="text-lg font-bold text-foreground opacity-50">₹</span>
                <span className="text-2xl font-black text-foreground">
                  {Math.round(data?.summary?.avgSaleValue || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-center text-muted-foreground font-bold mt-2">Per Transaction</p>
            </div>

            <div className="bg-primary rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[140px]">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 text-center">Operations Count</p>
              <div className="flex items-center justify-center gap-2 text-white">
                <span className="text-3xl font-black">
                  {data?.salesCount || 0}
                </span>
                <span className="text-[10px] font-black opacity-50 uppercase">Sales</span>
              </div>
              <p className="text-[8px] text-center text-white font-bold opacity-30 mt-2 uppercase tracking-tight">Verified Records Only</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
