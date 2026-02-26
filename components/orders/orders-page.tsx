"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import OrdersTable from "./orders-table"
import OrderModal from "./order-modal"
import ConfirmModal from "@/components/ui/confirm-modal"
import { Plus, Search, Calendar } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"
import { ordersApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { TableSkeletonLoader } from "@/components/ui/page-loader"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersApi.getAll()
      const data = (response.data || []).map((item: any) => ({
        ...item,
        id: item.id || item._id
      }))
      setOrders(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleAddOrder = async (data: any) => {
    try {
      if (editingId) {
        await ordersApi.update(editingId, data)
        toast({ title: "Success", description: "Order updated successfully" })
      } else {
        await ordersApi.create(data)
        toast({ title: "Success", description: "Order added successfully" })
      }
      fetchOrders()
      setIsModalOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (order: any) => {
    setSelectedOrder(order)
    setEditingId(order.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    setEditingId(id)
    setIsConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!editingId) return
    try {
      await ordersApi.delete(editingId)
      toast({ title: "Success", description: "Order deleted successfully" })
      fetchOrders()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete order",
        variant: "destructive",
      })
    } finally {
      setIsConfirmOpen(false)
      setEditingId(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const s = searchTerm.toLowerCase()
    const matchesSearch =
      (order.name?.toLowerCase() || "").includes(s) ||
      (order.phoneNumber || "").includes(searchTerm) ||
      (order.place?.toLowerCase() || "").includes(s)

    if (!matchesSearch) return false

    if (dateFilter.from && dateFilter.to) {
      return isDateInRange(order.date, dateFilter.from, dateFilter.to)
    }

    return true
  })

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Orders Ledger</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 font-bold uppercase tracking-widest opacity-60">Procurement & Fulfillment Queue</p>
          </div>
          <Button
            onClick={() => {
              setSelectedOrder(null)
              setEditingId(null)
              setIsModalOpen(true)
            }}
            className="bg-primary hover:bg-primary/90 text-white gap-2 w-full md:w-auto font-black shadow-xl shadow-primary/20 h-12 px-6"
          >
            <Plus size={20} /> Add Order
          </Button>
        </div>

        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-3 bg-white rounded-2xl border border-primary/5 px-6 py-4 shadow-lg">
            <Search size={22} className="text-primary/30" />
            <input
              placeholder="Search orders by customer identity or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-0 bg-transparent focus:outline-none focus:ring-0 font-black text-primary placeholder:text-primary/20 text-lg"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-2xl border border-primary/5 px-8 py-6 shadow-lg">
            <div className="flex items-center gap-4 min-w-max">
              <div className="p-3 bg-primary/5 rounded-xl text-primary"><Calendar size={24} /></div>
              <div>
                <span className="block text-xs font-black text-primary/40 uppercase tracking-widest">Order Period</span>
                <span className="text-sm font-black text-primary uppercase">Scheduled Range</span>
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
          <OrdersTable orders={filteredOrders} onEdit={handleEdit} onDelete={handleDelete as any} />
        )}

        <OrderModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedOrder(null)
            setEditingId(null)
          }}
          onSubmit={handleAddOrder}
          order={selectedOrder}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Order"
          message="Are you sure you want to delete this order? This action cannot be undone."
        />
      </div>
    </div>
  )
}
