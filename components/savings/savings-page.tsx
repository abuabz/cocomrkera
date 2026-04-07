"use client"

import { useState, useEffect } from "react"
import { 
    PiggyBank, 
    Plus, 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    Search, 
    Trash2, 
    Edit2, 
    FileText,
    ArrowUpCircle,
    ArrowDownCircle,
    Calculator,
    Filter
} from "lucide-react"
import { savingsApi } from "@/lib/api"
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
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function SavingsPage() {
    const [savings, setSavings] = useState<any[]>([])
    const [stats, setStats] = useState({ totalDeposits: 0, totalWithdrawals: 0, balance: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { toast } = useToast()
    
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
        type: "deposit",
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
                savingsApi.getAll(),
                savingsApi.getStats()
            ])
            const data = (recordsRes.data || []).map((item: any) => ({
                ...item,
                id: item.id || item._id
            }))
            setSavings(data)
            setStats(statsRes.data || { totalDeposits: 0, totalWithdrawals: 0, balance: 0 })
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
            type: "deposit",
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
                await savingsApi.update(editingId, data)
                toast({ title: "Success", description: "Record updated successfully" })
            } else {
                await savingsApi.create(data)
                toast({ title: "Success", description: "Savings record added" })
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
        if (!confirm("Are you sure you want to delete this record?")) return
        try {
            await savingsApi.delete(id)
            toast({ title: "Deleted", description: "Record removed successfully" })
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
            type: record.type,
            description: record.description || ""
        })
        setIsModalOpen(true)
    }

    const filteredSavings = savings.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-primary uppercase italic">Savings Matrix</h1>
                    <p className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-widest opacity-70">Log & Audit Treasury</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                     <Card className="bg-primary/5 border-primary/10 px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-3 shadow-sm">
                        <Calculator className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                        <div>
                            <p className="text-[8px] md:text-[10px] uppercase font-black text-muted-foreground leading-tight">Total Balance</p>
                            <p className="text-lg md:text-xl font-black text-primary leading-none">₹{stats.balance.toLocaleString()}</p>
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
                        Add Log
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <Card className="bg-green-500/5 border-green-500/10 col-span-1">
                    <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                        <CardTitle className="text-[10px] md:text-sm font-black uppercase text-green-600 flex items-center gap-1.5 md:gap-2">
                            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                            Deposits
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                        <p className="text-xl md:text-3xl font-black text-green-600 tracking-tighter">₹{stats.totalDeposits.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/5 border-red-500/10 col-span-1">
                    <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                        <CardTitle className="text-[10px] md:text-sm font-black uppercase text-red-600 flex items-center gap-1.5 md:gap-2">
                            <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
                            Withdraws
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                        <p className="text-xl md:text-3xl font-black text-red-600 tracking-tighter">₹{stats.totalWithdrawals.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/5 border-primary/10 col-span-2 md:col-span-1">
                    <CardHeader className="pb-1 md:pb-2 p-3 md:p-6">
                        <CardTitle className="text-[10px] md:text-sm font-black uppercase text-blue-600 flex items-center gap-1.5 md:gap-2">
                            <ArrowUpCircle className="w-3 h-3 md:w-4 md:h-4" />
                            Net Savings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                        <p className="text-xl md:text-3xl font-black text-blue-600 tracking-tighter">₹{stats.balance.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            {/* List Card */}
            <Card className="border-2 border-primary/5 shadow-xl overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b px-4 sm:px-6">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <PiggyBank className="w-5 h-5 text-primary" />
                            Transaction History
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">List of all recent savings activities.</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-64 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search history..." 
                            className="pl-10 rounded-full bg-muted/50 border-none focus-visible:ring-1 h-9 text-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center p-12">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filteredSavings.length === 0 ? (
                            <div className="text-center p-12 space-y-4">
                                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                    <FileText className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <p className="text-muted-foreground font-black uppercase text-[10px] sm:text-xs tracking-widest">No transactions found</p>
                            </div>
                        ) : (
                            filteredSavings.map((record) => (
                                <div 
                                    key={record.id} 
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-4 sm:px-6 hover:bg-primary/5 transition-all group gap-3"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                                        <div className={`p-2 sm:p-3 rounded-xl shrink-0 ${record.type === 'deposit' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                            {record.type === 'deposit' ? <ArrowUpCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : <ArrowDownCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-black text-sm sm:text-base md:text-lg uppercase tracking-tight truncate">{record.title}</h3>
                                                <span className={`text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase ${record.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {record.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground font-bold mt-0.5">
                                                <span className="flex items-center gap-1 shrink-0">
                                                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    {format(new Date(record.date), "dd MMM yy")}
                                                </span>
                                                {record.description && (
                                                    <span className="flex items-center gap-1 truncate opacity-70">
                                                        <Filter className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        {record.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 md:gap-8 mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-primary/5">
                                        <div className="text-left sm:text-right">
                                            <p className={`text-base sm:text-lg md:text-xl font-black ${record.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {record.type === 'deposit' ? '+' : '-'}₹{record.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10 text-primary" onClick={() => handleEdit(record)}>
                                                <Edit2 size={14} className="sm:size-16" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-red-500/10 text-red-500" onClick={() => handleDelete(record.id)}>
                                                <Trash2 size={14} className="sm:size-16" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal for Add/Edit */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary p-6 py-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-white uppercase italic flex items-center gap-2">
                                {editingId ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                {editingId ? "Edit Savings Record" : "New Savings Entry"}
                            </DialogTitle>
                            <DialogDescription className="text-white/70 font-medium italic">
                                {editingId ? "Modify the existng transaction details." : "Enter details for a new savings transaction."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-primary">Transaction Title</Label>
                            <Input 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="e.g. Monthly Profit Deposit" 
                                required 
                                className="rounded-xl border-2 font-bold focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-primary">Amount (₹)</Label>
                                <Input 
                                    type="number"
                                    value={formData.amount}
                                    onChange={e => setFormData({...formData, amount: e.target.value})}
                                    placeholder="0.00" 
                                    required 
                                    className="rounded-xl border-2 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-primary">Type</Label>
                                <Select 
                                    value={formData.type} 
                                    onValueChange={v => setFormData({...formData, type: v})}
                                >
                                    <SelectTrigger className="rounded-xl border-2 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="deposit" className="text-green-600 font-bold">Deposit (+)</SelectItem>
                                        <SelectItem value="withdrawal" className="text-red-600 font-bold">Withdrawal (-)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-primary">Date</Label>
                            <Input 
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                className="rounded-xl border-2 font-bold"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-primary">Description (Optional)</Label>
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full min-h-[100px] p-4 rounded-xl border-2 bg-background font-medium outline-none transition-all resize-none focus:border-primary"
                                placeholder="Add extra details here..."
                            />
                        </div>

                        <DialogFooter className="flex gap-2 pt-2 pb-2">
                            <Button type="button" variant="ghost" onClick={() => resetForm()} className="font-black uppercase">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving} className="flex-1 font-black uppercase italic shadow-lg shadow-primary/20">
                                {isSaving ? "Saving..." : editingId ? "Update Record" : "Save Transaction"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
