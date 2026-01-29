"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import OrdersTable from "./orders-table"
import OrderModal from "./order-modal"
import { Plus, Search, Calendar } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"

const SAMPLE_ORDERS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phoneNumber: "+91 98765 43210",
    place: "Bangalore",
    treeCount: 500,
    date: "2024-12-20",
  },
  {
    id: 2,
    name: "Priya Singh",
    phoneNumber: "+91 98765 43211",
    place: "Mumbai",
    treeCount: 600,
    date: "2024-12-19",
  },
  {
    id: 3,
    name: "Amit Patel",
    phoneNumber: "+91 98765 43212",
    place: "Pune",
    treeCount: 450,
    date: "2024-12-18",
  },
  {
    id: 4,
    name: "Anjali Sharma",
    phoneNumber: "+91 87654 32109",
    place: "Hyderabad",
    treeCount: 550,
    date: "2024-12-17",
  },
  {
    id: 5,
    name: "Vikram Reddy",
    phoneNumber: "+91 76543 21098",
    place: "Chennai",
    treeCount: 700,
    date: "2024-12-16",
  },
  {
    id: 6,
    name: "Deepika Verma",
    phoneNumber: "+91 65432 10987",
    place: "Delhi",
    treeCount: 400,
    date: "2024-12-15",
  },
  {
    id: 7,
    name: "Suresh Kumar",
    phoneNumber: "+91 54321 09876",
    place: "Kolkata",
    treeCount: 480,
    date: "2024-12-14",
  },
  {
    id: 8,
    name: "Neha Gupta",
    phoneNumber: "+91 43210 98765",
    place: "Jaipur",
    treeCount: 520,
    date: "2024-12-13",
  },
  {
    id: 9,
    name: "Arjun Singh",
    phoneNumber: "+91 32109 87654",
    place: "Lucknow",
    treeCount: 560,
    date: "2024-12-12",
  },
  {
    id: 10,
    name: "Meera Iyer",
    phoneNumber: "+91 21098 76543",
    place: "Kochi",
    treeCount: 620,
    date: "2024-12-11",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(SAMPLE_ORDERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleAddOrder = (data: any) => {
    if (editingId) {
      setOrders(orders.map((o) => (o.id === editingId ? { ...data, id: editingId } : o)))
      setEditingId(null)
    } else {
      setOrders([...orders, { ...data, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const handleEdit = (order: (typeof orders)[0]) => {
    setSelectedOrder(order)
    setEditingId(order.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setOrders(orders.filter((o) => o.id !== id))
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.includes(searchTerm) ||
      order.place.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (dateFilter.from && dateFilter.to) {
      return isDateInRange(order.date, dateFilter.from, dateFilter.to)
    }

    return true
  })

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-background to-background/95 min-h-screen w-full">
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

      <OrdersTable orders={filteredOrders} onEdit={handleEdit} onDelete={handleDelete} />

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
    </div>
  )
}
