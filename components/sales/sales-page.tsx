"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SalesTable from "./sales-table"
import SalesModal from "./sales-modal"
import ConfirmModal from "@/components/ui/confirm-modal"
import { Plus, Search, Calendar } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"
import { salesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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
    <div className="p-4 md:p-8 bg-linear-to-br from-background to-background/95 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Sales Management</h1>
        <Button
          onClick={() => {
            setSelectedSale(null)
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} /> Add Sales
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-4 py-3">
          <Search size={20} className="text-muted-foreground" />
          <Input
            placeholder="Search by customer name, employee, or payment mode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 bg-transparent focus:outline-none focus-visible:ring-0"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 bg-card rounded-lg border border-border px-4 py-3">
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
              placeholder="From Date"
            />
            <Input
              type="date"
              value={dateFilter.to}
              onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
              className="flex-1"
              placeholder="To Date"
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
        <div className="flex justify-center py-12 text-muted-foreground">Loading sales...</div>
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
  )
}
