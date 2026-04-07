"use client"

import { useState, useEffect } from "react"
import {
    Receipt,
    Plus,
    TrendingDown,
    Calendar,
    Search,
    Trash2,
    Edit2,
    FileText,
    Wallet,
    Info
} from "lucide-react"
import { expensesApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([])
    const [stats, setStats] = useState({ totalExpense: 0, count: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
        description: ""
    })

    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [recordsRes, statsRes] = await Promise.all([
                expensesApi.getAll(),
                expensesApi.getStats()
            ])
            const data = (recordsRes.data || []).map((item: any) => ({
                ...item,
                id: item.id || item._id
            }))
            setExpenses(data)
            setStats(statsRes.data || { totalExpense: 0, count: 0 })
        } catch (error: any) {
            toast({
                title: "Error fetching data",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            amount: "",
            date: format(new Date(), "yyyy-MM-dd"),
            description: ""
        })
        setEditingId(null)
        setIsModalOpen(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const data = {
                ...formData,
                amount: parseFloat(formData.amount)
            }

            if (editingId) {
                await expensesApi.update(editingId, data)
                toast({ title: "Success", description: "Expense updated" })
            } else {
                await expensesApi.create(data)
                toast({ title: "Success", description: "Expense added" })
            }

            resetForm()
            fetchData()
        } catch (error: any) {
            toast({
                title: "Operation failed",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this expense?")) return
        try {
            await expensesApi.delete(id)
            toast({ title: "Deleted", description: "Expense removed" })
            fetchData()
        } catch (error: any) {
            toast({
                title: "Delete failed",
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const handleEdit = (record: any) => {
        setEditingId(record.id)
        setFormData({
            title: record.title,
            amount: record.amount.toString(),
            date: format(new Date(record.date), "yyyy-MM-dd"),
            description: record.description || ""
        })
        setIsModalOpen(true)
    }

    const filteredExpenses = expenses.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-primary uppercase italic">Expense Ledger</h1>
                    <p className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-widest opacity-70">Inventory & Operational Costs</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Card className="bg-red-800/5 border-red-800/10 px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-3 shadow-sm">
                        <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-red-800" />
                        <div>
                            <p className="text-[8px] md:text-[10px] uppercase font-black text-muted-foreground leading-tight">Total Spent</p>
                            <p className="text-lg md:text-xl font-black text-red-800 leading-none tracking-tighter">₹{stats.totalExpense.toLocaleString()}</p>
                        </div>
                    </Card>
                    <Button
                        onClick={() => {
                            resetForm()
                            setIsModalOpen(true)
                        }}
                        className="font-black uppercase h-10 md:h-12 py-0 px-4 md:px-6 shadow-lg shadow-primary/20 text-xs md:text-sm flex-1 sm:flex-none"
                    >
                        <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                        Log Expense
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                <Card className="bg-red-800/10 border-red-800/20 shadow-lg shadow-red-800/10 col-span-2 md:col-span-1">
                    <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                        <CardTitle className="text-[10px] md:text-sm font-black uppercase text-red-800 flex items-center gap-1.5 md:gap-2">
                            <Wallet className="w-3 h-3 md:w-4 md:h-4" />
                            Total Expenditure
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                        <p className="text-2xl md:text-4xl font-black text-red-800 tracking-tighter">₹{stats.totalExpense.toLocaleString()}</p>
                        <p className="text-[8px] md:text-xs font-bold text-muted-foreground mt-1 md:mt-2 uppercase tracking-widest leading-tight">Across {stats.count} recorded entries</p>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10 col-span-2 md:col-span-1">
                    <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                        <CardTitle className="text-[10px] md:text-sm font-black uppercase text-primary flex items-center gap-1.5 md:gap-2">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            Active Period
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                        <p className="text-2xl md:text-4xl font-black text-primary tracking-tighter uppercase italic leading-none">{format(new Date(), "MMMM yyyy")}</p>
                        <p className="text-[8px] md:text-xs font-bold text-muted-foreground mt-1 md:mt-2 uppercase tracking-widest leading-tight">Business Cycle 2026</p>
                    </CardContent>
                </Card>
            </div>

            {/* List Card */}
            <Card className="border-2 border-primary/5 shadow-2xl overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-muted/10 p-4 sm:p-6">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Receipt className="w-5 h-5 text-red-800" />
                            Expense Registry
                        </CardTitle>
                    </div>
                    <div className="relative w-full sm:w-64 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter records..."
                            className="pl-10 rounded-full border-2 focus-visible:ring-primary/20 bg-background h-9 text-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y relative overflow-x-hidden">
                        {isLoading ? (
                            <div className="flex justify-center p-12">
                                <div className="w-8 h-8 border-4 border-red-800 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filteredExpenses.length === 0 ? (
                            <div className="text-center p-12">
                                <FileText className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
                                <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">No records found</p>
                            </div>
                        ) : (
                            filteredExpenses.map((record) => (
                                <div
                                    key={record.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-4 sm:px-8 hover:bg-red-800/5 transition-all group gap-3"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                                        <div className="p-2 sm:p-3 bg-red-800 text-white rounded-xl shadow-md shrink-0 group-hover:scale-105 transition-transform">
                                            <TrendingDown size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-foreground truncate">{record.title}</h3>
                                            <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                                                <span className="flex items-center gap-1 shrink-0">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(record.date), "dd MMM yy")}
                                                </span>
                                                {record.description && (
                                                    <span className="flex items-center gap-1 truncate opacity-70">
                                                        <Info className="w-3 h-3" />
                                                        {record.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-primary/5">
                                        <div className="text-left sm:text-right">
                                            <p className="text-lg sm:text-xl md:text-2xl font-black text-red-800 tracking-tighter">
                                                ₹{record.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                                            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10 text-primary" onClick={() => handleEdit(record)}>
                                                <Edit2 size={14} className="sm:size-18" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-red-800/10 text-red-800" onClick={() => handleDelete(record.id)}>
                                                <Trash2 size={14} className="sm:size-18" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal for Add/Edit Expense */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-red-800 p-6 py-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-white uppercase italic flex items-center gap-2">
                                {editingId ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                {editingId ? "Update Expenditure" : "New Expense Entry"}
                            </DialogTitle>
                            <DialogDescription className="text-white/70 font-medium italic">
                                {editingId ? "Modify the existng business expenditure details." : "Enter details for a new business cost entry."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-red-800">Expense Title</Label>
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Fuel, Maintenance, Rent"
                                required
                                className="rounded-xl border-2 font-bold focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-red-800">Amount (₹)</Label>
                                <Input
                                    type="number"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                    required
                                    className="rounded-xl border-2 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-red-800">Date</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="rounded-xl border-2 font-bold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-red-800">Description (Optional)</Label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[120px] p-4 rounded-xl border-2 bg-background font-medium outline-none transition-all resize-none focus:border-red-800"
                                placeholder="Additional details..."
                            />
                        </div>

                        <DialogFooter className="flex gap-2 pt-2 pb-2">
                            <Button type="button" variant="ghost" onClick={() => resetForm()} className="font-black uppercase">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving} className="flex-1 font-black uppercase italic bg-red-800 hover:bg-red-900 shadow-lg shadow-red-800/20">
                                {isSaving ? "Saving..." : editingId ? "Update Entry" : "Log Expense"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
