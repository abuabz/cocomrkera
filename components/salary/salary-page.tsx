"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SalaryTable from "./salary-table"
import SalaryModal from "./salary-modal"
import ConfirmModal from "@/components/ui/confirm-modal"
import { Plus, Search, Calendar, Banknote, TrendingUp } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"
import { salariesApi, employeesApi } from "@/lib/api"
import { TableSkeletonLoader } from "@/components/ui/page-loader"
import { useToast } from "@/hooks/use-toast"

export default function SalaryPage() {
    const [salaries, setSalaries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [dateFilter, setDateFilter] = useState({
        from: "",
        to: "",
    })

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [selectedSalary, setSelectedSalary] = useState<any | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchSalaries = async () => {
        try {
            setLoading(true)
            const response = await salariesApi.getAll()
            const mappedSalaries = (response.data || []).map((salary: any) => ({
                ...salary,
                id: salary.id || salary._id,
                employeeName: salary.employee?.name || "Unknown",
                employeeCode: salary.employee?.code || "",
            }))
            setSalaries(mappedSalaries)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to fetch salaries",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSalaries()
    }, [])

    const handleAddSalary = async (data: any) => {
        try {
            if (editingId) {
                await salariesApi.update(editingId, data)
                toast({ title: "Success", description: "Salary updated successfully" })
            } else {
                await salariesApi.create(data)
                toast({ title: "Success", description: "Salary recorded successfully" })
            }
            fetchSalaries()
            setIsModalOpen(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Operation failed",
                variant: "destructive",
            })
        }
    }

    const handleEdit = (salary: any) => {
        setSelectedSalary(salary)
        setEditingId(salary.id)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        setEditingId(id)
        setIsConfirmOpen(true)
    }

    const confirmDelete = async () => {
        if (!editingId) return
        try {
            await salariesApi.delete(editingId)
            toast({ title: "Success", description: "Salary record deleted successfully" })
            fetchSalaries()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete salary record",
                variant: "destructive",
            })
        } finally {
            setIsConfirmOpen(false)
            setEditingId(null)
        }
    }

    const filteredSalaries = salaries.filter((salary) => {
        const s = searchTerm.toLowerCase()
        const matchesSearch =
            (salary.employeeName?.toLowerCase() || "").includes(s) ||
            (salary.employeeCode?.toLowerCase() || "").includes(s) ||
            (salary.paymentMethod?.toLowerCase() || "").includes(s)

        if (!matchesSearch) return false

        if (dateFilter.from && dateFilter.to) {
            return isDateInRange(salary.paymentDate, dateFilter.from, dateFilter.to)
        }

        return true
    })

    const totalSalary = filteredSalaries.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

    return (
        <div className="p-4 md:p-6 bg-background min-h-screen w-full">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary shadow-sm">
                            <Banknote size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Salary Payroll</h1>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Employee Remuneration Logs</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedSalary(null)
                            setEditingId(null)
                            setIsModalOpen(true)
                        }}
                        className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto font-black shadow-xl shadow-primary/20 h-12 px-6"
                    >
                        <Plus size={20} /> Record Salary
                    </Button>
                </div>

                {/* Salary Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-secondary p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 p-4 opacity-10"><Banknote size={80} /></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Monthly Payout</p>
                        <h3 className="text-3xl font-black tracking-tighter text-white">₹{totalSalary.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-lg">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Transaction Volume</p>
                        <h3 className="text-3xl font-black text-primary tracking-tighter">{filteredSalaries.length} <span className="text-sm font-bold opacity-30">RECORDS</span></h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-lg">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Average Remuneration</p>
                        <h3 className="text-3xl font-black text-primary tracking-tighter">₹{filteredSalaries.length > 0 ? Math.round(totalSalary / filteredSalaries.length).toLocaleString() : 0}</h3>
                    </div>
                </div>

                <div className="mb-10 space-y-4">
                    <div className="flex items-center gap-3 bg-white rounded-2xl border border-primary/5 shadow-lg px-6 py-4">
                        <Search size={22} className="text-primary/30" />
                        <input
                            placeholder="Search workers by name or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-0 bg-transparent focus:outline-none focus:ring-0 font-black text-primary placeholder:text-primary/20 text-lg"
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-2xl border border-primary/5 shadow-lg px-8 py-6">
                        <div className="flex items-center gap-4 min-w-max">
                            <div className="p-3 bg-primary/5 rounded-xl text-primary"><Calendar size={24} /></div>
                            <div>
                                <span className="block text-xs font-black text-primary/40 uppercase tracking-widest">Time Period</span>
                                <span className="text-sm font-black text-primary uppercase">Activity Range</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 flex-1 items-end">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-widest">Start Date</label>
                                <Input type="date" value={dateFilter.from} onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })} className="h-11 font-bold border-primary/10" />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-widest">End Date</label>
                                <Input type="date" value={dateFilter.to} onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })} className="h-11 font-bold border-primary/10" />
                            </div>
                            <div className="flex flex-wrap gap-2 pb-1">
                                <Button variant="outline" size="sm" onClick={() => {
                                    const now = new Date();
                                    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                                    const end = now.toISOString().split('T')[0];
                                    setDateFilter({ from: start, to: end });
                                }} className="font-black text-[10px] uppercase h-11 border-primary/10 hover:bg-primary/5">This Month</Button>

                                <Button variant="outline" size="sm" onClick={() => {
                                    const now = new Date();
                                    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                                    const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                                    setDateFilter({ from: start, to: end });
                                }} className="font-black text-[10px] uppercase h-11 border-primary/10 hover:bg-primary/5">Prev Month</Button>

                                {(dateFilter.from || dateFilter.to) && (
                                    <Button variant="ghost" size="sm" onClick={() => setDateFilter({ from: "", to: "" })} className="text-red-500 font-black text-[10px] uppercase h-11 px-4 hover:bg-red-50/50">Reset</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <TableSkeletonLoader />
                ) : (
                    <SalaryTable salaries={filteredSalaries} onEdit={handleEdit} onDelete={handleDelete} />
                )}

                <SalaryModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedSalary(null)
                        setEditingId(null)
                    }}
                    onSubmit={handleAddSalary}
                    salary={selectedSalary}
                />

                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Salary Record"
                    message="Are you sure you want to delete this salary record? This action cannot be undone."
                />
            </div>
        </div>
    )
}
