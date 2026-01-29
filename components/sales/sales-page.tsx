"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SalesTable from "./sales-table"
import SalesModal from "./sales-modal"
import { Plus, Search, Calendar } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"

const SAMPLE_SALES = [
  {
    id: 1,
    customer: "Rajesh Kumar",
    employees: ["Priya Singh", "Amit Patel"],
    date: "2024-12-20",
    trees: [1200, 800],
    totalTrees: 2000,
    perTreeAmount: 50,
    totalAmount: 100000,
    paymentMode: "Cash",
  },
  {
    id: 2,
    customer: "Priya Singh",
    employees: ["Deepika Verma"],
    date: "2024-12-19",
    trees: [1500],
    totalTrees: 1500,
    perTreeAmount: 45,
    totalAmount: 67500,
    paymentMode: "Bank Transfer",
  },
  {
    id: 3,
    customer: "Amit Patel",
    employees: ["Arjun Singh", "Meera Iyer"],
    date: "2024-12-18",
    trees: [900, 600],
    totalTrees: 1500,
    perTreeAmount: 50,
    totalAmount: 75000,
    paymentMode: "Cash",
  },
  {
    id: 4,
    customer: "Anjali Sharma",
    employees: ["Suresh Kumar"],
    date: "2024-12-17",
    trees: [1100],
    totalTrees: 1100,
    perTreeAmount: 48,
    totalAmount: 52800,
    paymentMode: "Bank Transfer",
  },
  {
    id: 5,
    customer: "Vikram Reddy",
    employees: ["Neha Gupta", "Rajesh Kumar"],
    date: "2024-12-16",
    trees: [800, 700],
    totalTrees: 1500,
    perTreeAmount: 50,
    totalAmount: 75000,
    paymentMode: "Cash",
  },
  {
    id: 6,
    customer: "Deepika Verma",
    employees: ["Amit Patel"],
    date: "2024-12-15",
    trees: [950],
    totalTrees: 950,
    perTreeAmount: 52,
    totalAmount: 49400,
    paymentMode: "Bank Transfer",
  },
  {
    id: 7,
    customer: "Suresh Kumar",
    employees: ["Arjun Singh"],
    date: "2024-12-14",
    trees: [1000],
    totalTrees: 1000,
    perTreeAmount: 50,
    totalAmount: 50000,
    paymentMode: "Cash",
  },
  {
    id: 8,
    customer: "Neha Gupta",
    employees: ["Meera Iyer", "Deepika Verma"],
    date: "2024-12-13",
    trees: [750, 850],
    totalTrees: 1600,
    perTreeAmount: 48,
    totalAmount: 76800,
    paymentMode: "Bank Transfer",
  },
  {
    id: 9,
    customer: "Arjun Singh",
    employees: ["Priya Singh"],
    date: "2024-12-12",
    trees: [1200],
    totalTrees: 1200,
    perTreeAmount: 50,
    totalAmount: 60000,
    paymentMode: "Cash",
  },
  {
    id: 10,
    customer: "Meera Iyer",
    employees: ["Vikram Reddy", "Suresh Kumar"],
    date: "2024-12-11",
    trees: [1300, 700],
    totalTrees: 2000,
    perTreeAmount: 50,
    totalAmount: 100000,
    paymentMode: "Bank Transfer",
  },
]

export default function SalesPage() {
  const [sales, setSales] = useState(SAMPLE_SALES)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<(typeof sales)[0] | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleAddSale = (data: any) => {
    if (editingId) {
      setSales(sales.map((s) => (s.id === editingId ? { ...data, id: editingId } : s)))
      setEditingId(null)
    } else {
      setSales([...sales, { ...data, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const handleEdit = (sale: (typeof sales)[0]) => {
    setSelectedSale(sale)
    setEditingId(sale.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setSales(sales.filter((s) => s.id !== id))
  }

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.employees.join(", ").toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.paymentMode.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (dateFilter.from && dateFilter.to) {
      return isDateInRange(sale.date, dateFilter.from, dateFilter.to)
    }

    return true
  })

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-background to-background/95 w-full">
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

      <SalesTable sales={filteredSales} onEdit={handleEdit} onDelete={handleDelete} />

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
    </div>
  )
}
