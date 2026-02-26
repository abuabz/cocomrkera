"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SalesTable from "./sales-table"
import SalesModal from "./sales-modal"
import ConfirmModal from "@/components/ui/confirm-modal"
import { Plus, Search, Calendar, TrendingUp } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"
import { salesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { TableSkeletonLoader } from "@/components/ui/page-loader"

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<any | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSales = async () => {
    try {
      setLoading(true)
      const response = await salesApi.getAll()
      // Map the data for the table
      const mappedSales = (response.data || []).map((sale: any) => ({
        ...sale,
        id: sale.id || sale._id,
        customerName: sale.customerId?.name || "Unknown",
        employeeNames: (sale.employees || []).map((emp: any) => emp.name || "Unknown"),
        date: sale.saleDate,
      }))
      setSales(mappedSales)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch sales",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const handleAddSale = async (data: any) => {
    try {
      if (editingId) {
        await salesApi.update(editingId, data)
        toast({ title: "Success", description: "Sale updated successfully" })
      } else {
        await salesApi.create(data)
        toast({ title: "Success", description: "Sale added successfully" })
      }
      fetchSales()
      setIsModalOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (sale: any) => {
    setSelectedSale(sale)
    setEditingId(sale.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    setEditingId(id)
    setIsConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!editingId) return
    try {
      await salesApi.delete(editingId)
      toast({ title: "Success", description: "Sale deleted successfully" })
      fetchSales()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete sale",
        variant: "destructive",
      })
    } finally {
      setIsConfirmOpen(false)
      setEditingId(null)
    }
  }

  const filteredSales = sales.filter((sale) => {
    const s = searchTerm.toLowerCase()
    const matchesSearch =
      (sale.customerName?.toLowerCase() || "").includes(s) ||
      (sale.employeeNames?.join(", ")?.toLowerCase() || "").includes(s) ||
      (sale.paymentMode?.toLowerCase() || "").includes(s)

    if (!matchesSearch) return false

    if (dateFilter.from && dateFilter.to) {
      return isDateInRange(sale.date, dateFilter.from, dateFilter.to)
    }

    return true
  })

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-primary">Sales Management</h1>
          <Button
            onClick={() => {
              setSelectedSale(null)
              setEditingId(null)
              setIsModalOpen(true)
            }}
            className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto font-bold"
          >
            <Plus size={20} /> Add Sales
          </Button>
        </div>

        {/* Sales Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={60} /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Total Sales Amount</p>
            <h3 className="text-3xl font-black">₹{filteredSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0).toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-lg">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Trees Plucked</p>
            <h3 className="text-3xl font-black text-primary">{filteredSales.reduce((acc, s) => acc + (s.totalTrees || 0), 0).toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-lg">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Average per Sale</p>
            <h3 className="text-3xl font-black text-secondary">₹{filteredSales.length > 0 ? Math.round(filteredSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0) / filteredSales.length).toLocaleString() : "0"}</h3>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-primary/5 shadow-sm px-4 py-3">
            <Search size={20} className="text-primary/40" />
            <input
              placeholder="Search by customer name, employee, or payment mode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-0 bg-transparent focus:outline-none focus:ring-0 font-bold text-sm"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 bg-white rounded-xl border border-primary/5 shadow-sm px-6 py-5">
            <div className="flex items-center gap-3 min-w-max">
              <div className="p-2 bg-primary/5 rounded-lg text-primary"><Calendar size={20} /></div>
              <span className="text-sm font-black text-primary/70 uppercase tracking-widest">Filter Period</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-1 items-end">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">From</label>
                <Input type="date" value={dateFilter.from} onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">To</label>
                <Input type="date" value={dateFilter.to} onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })} />
              </div>
              <div className="flex flex-wrap gap-2 pb-1">
                <Button variant="outline" size="sm" onClick={() => {
                  const now = new Date();
                  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                  const end = now.toISOString().split('T')[0];
                  setDateFilter({ from: start, to: end });
                }} className="font-black text-[10px] uppercase">This Month</Button>

                <Button variant="outline" size="sm" onClick={() => {
                  const now = new Date();
                  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                  const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                  setDateFilter({ from: start, to: end });
                }} className="font-black text-[10px] uppercase">Prev Month</Button>

                {(dateFilter.from || dateFilter.to) && (
                  <Button variant="ghost" size="sm" onClick={() => setDateFilter({ from: "", to: "" })} className="text-red-600 font-black text-[10px] uppercase">Reset</Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeletonLoader />
        ) : (
          <SalesTable sales={filteredSales} onEdit={handleEdit} onDelete={handleDelete as any} />
        )}

        <SalesModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedSale(null)
            setEditingId(null)
          }}
          onSubmit={handleAddSale}
          sale={selectedSale}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Sale"
          message="Are you sure you want to delete this sale record? This action cannot be undone."
        />
      </div>
    </div>
  )
}
