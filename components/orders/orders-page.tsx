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
    <div className="p-4 md:p-8 bg-linear-to-br from-background to-background/95 min-h-screen w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders</p>
        </div>
        <Button
          onClick={() => {
            setSelectedOrder(null)
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-full md:w-auto"
        >
          <Plus size={20} /> Add Order
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-4 py-3">
          <Search size={20} className="text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or place..."
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
        <div className="flex justify-center py-12 text-muted-foreground">Loading orders...</div>
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
  )
}
