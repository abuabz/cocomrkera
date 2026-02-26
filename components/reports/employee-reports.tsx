"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Filter, Calendar,
    TrendingUp, Hash, Users,
    RefreshCcw, AlertCircle
} from "lucide-react"
import { statsApi, employeesApi, salesApi, salariesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { TableSkeletonLoader } from "@/components/ui/page-loader"

export default function EmployeeReports() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Default to current month
    const [dateRange, setDateRange] = useState({
        from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        to: format(new Date(), "yyyy-MM-dd"),
    })

    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))
    const { toast } = useToast()

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            if (dateRange.from && dateRange.to && dateRange.from > dateRange.to) {
                throw new Error("Start date cannot be later than end date")
            }

            // Fetch all required raw data in parallel
            const [empRes, salesRes, salaryRes] = await Promise.all([
                employeesApi.getAll(),
                salesApi.getAll(),
                salariesApi.getAll()
            ])

            const employees = empRes.data || []
            const allSales = salesRes.data || []
            const allSalaries = salaryRes.data || []

            // Aggregate data per employee
            const aggregatedData = employees.map((emp: any) => {
                const empId = emp.id || emp._id

                // Filter and calculate sales for this employee
                const empSales = allSales.filter((sale: any) => {
                    const saleDateStr = sale.saleDate || sale.date;
                    let inRange = false;
                    if (saleDateStr) {
                        const d = typeof saleDateStr === 'string' ? saleDateStr.split('T')[0] : new Date(saleDateStr).toISOString().split('T')[0];
                        inRange = (!dateRange.from || d >= dateRange.from) && (!dateRange.to || d <= dateRange.to);
                    } else {
                        inRange = true; // no date on sale
                    }
                    const isAssigned = (sale.employees || []).some((e: any) => (e.id || e._id) === empId)
                    return inRange && isAssigned
                })

                let totalSalesAmount = 0
                let totalTreesHarvested = 0

                empSales.forEach((sale: any) => {
                    const empIndex = (sale.employees || []).findIndex((e: any) => (e.id || e._id) === empId)
                    if (empIndex !== -1) {
                        const trees = sale.treesHarvested?.[empIndex] || 0
                        totalTreesHarvested += trees

                        // Proportional revenue share
                        const totalTreesInSale = sale.totalTrees || (sale.treesHarvested || []).reduce((a: number, b: number) => a + b, 0) || 1
                        const shareRatio = trees / totalTreesInSale
                        totalSalesAmount += (sale.totalAmount || 0) * shareRatio
                    }
                })

                // Filter and calculate salaries for this employee
                const empSalaries = allSalaries.filter((salary: any) => {
                    const payDateStr = salary.paymentDate || salary.date;
                    let inRange = false;
                    if (payDateStr) {
                        const d = typeof payDateStr === 'string' ? payDateStr.split('T')[0] : new Date(payDateStr).toISOString().split('T')[0];
                        inRange = (!dateRange.from || d >= dateRange.from) && (!dateRange.to || d <= dateRange.to);
                    } else {
                        inRange = true;
                    }
                    const isEmp = (salary.employee === empId || salary.employee?._id === empId || salary.employee?.id === empId)
                    return inRange && isEmp
                })

                const totalSalaryPaid = empSalaries.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0)

                return {
                    id: empId,
                    name: emp.name,
                    code: emp.code,
                    totalTreesHarvested,
                    totalSalesAmount,
                    totalSalaryPaid,
                    profit: totalSalesAmount - totalSalaryPaid
                }
            })

            // Filter out employees with no activity if needed, or show all
            setData(aggregatedData.filter((d: any) => d.totalTreesHarvested > 0 || d.totalSalaryPaid > 0))
        } catch (error: any) {
            console.error("Aggregation Error:", error)
            setError(error.message || "Failed to generate report")
            toast({
                title: "Report Error",
                description: "Failed to aggregate performance data.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [dateRange, toast])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const monthVal = e.target.value; // yyyy-MM
        setSelectedMonth(monthVal);
        if (monthVal) {
            const [y, m] = monthVal.split('-');
            const date = new Date(parseInt(y), parseInt(m) - 1, 1);
            setDateRange({
                from: format(startOfMonth(date), "yyyy-MM-dd"),
                to: format(endOfMonth(date), "yyyy-MM-dd"),
            });
        }
    }

    const reportList = Array.isArray(data) ? data : []
    const totals = reportList.reduce(
        (acc, curr) => ({
            sales: acc.sales + (Number(curr.totalSalesAmount) || 0),
            salary: acc.salary + (Number(curr.totalSalaryPaid) || 0),
            profit: acc.profit + (Number(curr.profit) || 0),
            trees: acc.trees + (Number(curr.totalTreesHarvested) || 0),
        }),
        { sales: 0, salary: 0, profit: 0, trees: 0 }
    )


    return (
        <div className="p-4 md:p-6 bg-background min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4 print:mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight flex items-center gap-2">
                            <TrendingUp className="text-secondary" size={28} />
                            Employee Work Report
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Employee-wise Sales & Salary balance calculation</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={fetchReports} className="gap-2 shadow-sm border-primary/20">
                            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh
                        </Button>
                    </div>
                </div>

                {/* Date Filter */}
                <Card className="mb-6 border-sidebar-border/10 shadow-sm bg-white">
                    <CardHeader className="py-4 bg-sidebar/5 border-b border-sidebar-border/5">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-primary/70 uppercase tracking-[0.2em]">
                            <Filter size={14} className="text-secondary" />
                            Filter Employees By Date
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-wrap gap-6 items-end">
                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 tracking-wider">
                                    <Calendar size={12} className="text-secondary" /> Select Month
                                </label>
                                <Input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    className="bg-white border-primary/10 transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 font-medium"
                                />
                            </div>

                            <div className="h-10 w-px bg-primary/5 hidden md:block mx-1" />

                            <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">From Date</label>
                                <Input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => {
                                        setDateRange({ ...dateRange, from: e.target.value })
                                        setSelectedMonth("")
                                    }}
                                    className="bg-white border-primary/10 font-medium"
                                />
                            </div>
                            <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">To Date</label>
                                <Input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => {
                                        setDateRange({ ...dateRange, to: e.target.value })
                                        setSelectedMonth("")
                                    }}
                                    className="bg-white border-primary/10 font-medium"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const now = new Date();
                                        setDateRange({
                                            from: format(startOfMonth(now), "yyyy-MM-dd"),
                                            to: format(now, "yyyy-MM-dd")
                                        })
                                        setSelectedMonth(format(now, "yyyy-MM"))
                                    }}
                                    className="font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary/5"
                                >
                                    This Month
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const prev = subMonths(new Date(), 1);
                                        setDateRange({
                                            from: format(startOfMonth(prev), "yyyy-MM-dd"),
                                            to: format(endOfMonth(prev), "yyyy-MM-dd")
                                        })
                                        setSelectedMonth(format(prev, "yyyy-MM"))
                                    }}
                                    className="font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary/5"
                                >
                                    Last Month
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setDateRange({ from: "", to: "" })
                                        setSelectedMonth("")
                                    }}
                                    className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest hover:text-destructive"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {loading ? (
                    <div className="mt-8">
                        <TableSkeletonLoader />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-4 bg-destructive/10 text-destructive rounded-full mb-4">
                            <AlertCircle size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
                        <p className="text-muted-foreground max-w-md font-medium mb-6">{error}</p>
                        <Button onClick={() => fetchReports()} variant="outline" className="border-primary/20">
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Detailed Table */}
                        <Card className="border border-border shadow-sm overflow-hidden mb-8 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between py-5 px-6 border-b border-border">
                                <div>
                                    <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                                        <Users size={20} className="text-secondary" />
                                        Employee Account Balances
                                    </CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">
                                        {reportList.length} Employees
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                                                <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-sm w-16">No.</TableHead>
                                                <TableHead className="font-semibold text-muted-foreground py-4 px-6 text-sm min-w-[200px]">Employee Name</TableHead>
                                                <TableHead className="text-center font-semibold text-muted-foreground text-sm whitespace-nowrap">Total Trees Plucked</TableHead>
                                                <TableHead className="text-right font-semibold text-muted-foreground text-sm whitespace-nowrap">Total Sales Amount</TableHead>
                                                <TableHead className="text-right font-semibold text-muted-foreground text-sm whitespace-nowrap">Salary Paid</TableHead>
                                                <TableHead className="text-right font-semibold text-muted-foreground px-6 text-sm whitespace-nowrap">Profit / Balance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reportList.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground/60 italic font-medium">
                                                        No activity records found for this period
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                reportList.map((row, index) => (
                                                    <TableRow key={row.id} className="hover:bg-muted/10 transition-colors">
                                                        <TableCell className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</TableCell>
                                                        <TableCell className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-base text-foreground">{row.name}</span>
                                                                {row.code && <span className="text-xs text-muted-foreground mt-0.5">{row.code}</span>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center font-medium text-base text-foreground">
                                                            {(row.totalTreesHarvested || 0).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium text-base text-secondary">
                                                            ₹{Math.round(row.totalSalesAmount).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium text-base text-muted-foreground">
                                                            ₹{row.totalSalaryPaid.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right px-6 py-4">
                                                            <div className={`inline-flex px-3 py-1 rounded-full font-bold text-sm ${row.profit >= 0
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                ₹{Math.round(row.profit).toLocaleString()}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                        {reportList.length > 0 && (
                                            <tfoot className="bg-muted/30 border-t border-border">
                                                <TableRow className="font-bold">
                                                    <TableCell colSpan={2} className="px-6 py-4 text-base text-primary">Totals</TableCell>
                                                    <TableCell className="text-center text-base text-foreground">{totals.trees.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-base text-secondary">₹{Math.round(totals.sales).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-base text-foreground">₹{totals.salary.toLocaleString()}</TableCell>
                                                    <TableCell className={`text-right px-6 py-4 text-base ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        ₹{Math.round(totals.profit).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            </tfoot>
                                        )}
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Report Footer Information */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground mb-8">
                            <div className="flex items-center gap-2">
                                <Hash size={12} /> Document ID: MRK-PERF-{format(new Date(), "yyyyMMdd-HHmm")}
                            </div>
                            <div className="flex items-center gap-4">
                                <span>Analysis Date: {format(new Date(), "PPpp")}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
