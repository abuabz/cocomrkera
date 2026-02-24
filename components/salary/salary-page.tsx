"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SalaryTable from "./salary-table"
import SalaryModal from "./salary-modal"
import ConfirmModal from "@/components/ui/confirm-modal"
import { Plus, Search, Calendar, Banknote } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"
import { salariesApi } from "@/lib/api"
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

    const totalSalary = filteredSalaries.reduce((acc, curr) => acc + (curr.amount || 0), 0)

    return (
        <div className="p-4 md:p-8 bg-linear-to-br from-background to-background/95 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary/20 rounded-xl text-secondary">
                        <Banknote size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Employee Salaries</h1>
                        <p className="text-muted-foreground">Manage and track employee payments</p>
                    </div>
                </div>
                <Button
                    onClick={() => {
                        setSelectedSalary(null)
                        setEditingId(null)
                        setIsModalOpen(true)
                    }}
                    className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Record Salary
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                    <h3 className="text-3xl font-bold text-foreground">{filteredSalaries.length}</h3>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Total Salary Paid</p>
                    <h3 className="text-3xl font-bold text-secondary">₹{totalSalary.toLocaleString()}</h3>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Avg. Payment</p>
                    <h3 className="text-3xl font-bold text-primary">
                        ₹{filteredSalaries.length > 0 ? Math.round(totalSalary / filteredSalaries.length).toLocaleString() : 0}
                    </h3>
                </div>
            </div>

            <div className="mb-6 space-y-4">
                <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-4 py-3 shadow-sm">
                    <Search size={20} className="text-muted-foreground" />
                    <Input
                        placeholder="Search by employee name, code, or payment method..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-0 bg-transparent focus:outline-none focus-visible:ring-0"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 bg-card rounded-lg border border-border px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Filter by Date:</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 flex-1">
                        <Input
                            type="date"
                            value={dateFilter.from}
                            onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                            className="flex-1"
                        />
                        <Input
                            type="date"
                            value={dateFilter.to}
                            onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                            className="flex-1"
                        />
                        {(dateFilter.from || dateFilter.to) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDateFilter({ from: "", to: "" })}
                                className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p>Loading salary records...</p>
                </div>
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
    )
}
