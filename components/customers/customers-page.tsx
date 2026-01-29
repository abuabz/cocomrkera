"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CustomersTable from "./customers-table"
import CustomerModal from "./customer-modal"
import MapModal from "./map-modal"
import { Plus, Search, Calendar } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"

const SAMPLE_CUSTOMERS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    code: "CUST001",
    phone: "9876543210",
    altPhone: "9876543211",
    place: "Bangalore",
    treeCount: 120,
    lastHarvest: "2024-12-15",
    nextHarvest: "2025-02-13",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0697806435507!2d77.59399!3d13.001624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae173fdb8aabcd%3A0xf8e8f0f0f0f0f0f0!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 2,
    name: "Priya Singh",
    code: "CUST002",
    phone: "9876543211",
    altPhone: "9876543212",
    place: "Mumbai",
    treeCount: 250,
    lastHarvest: "2024-12-10",
    nextHarvest: "2025-02-08",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.0697806435507!2d72.87962!3d19.076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9d8d8d8d8d9%3A0xf8e8f0f0f0f0f0f0!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 3,
    name: "Amit Patel",
    code: "CUST003",
    phone: "9876543212",
    altPhone: "9876543213",
    place: "Pune",
    treeCount: 180,
    lastHarvest: "2024-12-12",
    nextHarvest: "2025-02-10",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.0697806435507!2d73.85674!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0f8f0f0f0f1%3A0xf8e8f0f0f0f0f0f0!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 4,
    name: "Anjali Sharma",
    code: "CUST004",
    phone: "8765432109",
    altPhone: "8765432110",
    place: "Hyderabad",
    treeCount: 200,
    lastHarvest: "2024-12-14",
    nextHarvest: "2025-02-12",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0697806435507!2d78.47566!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93a1f0f0f0f1%3A0xf8e8f0f0f0f0f0f0!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 5,
    name: "Vikram Reddy",
    code: "CUST005",
    phone: "7654321098",
    altPhone: "7654321099",
    place: "Chennai",
    treeCount: 150,
    lastHarvest: "2024-12-18",
    nextHarvest: "2025-02-16",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0697806435507!2d80.27847!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f63fb8f0f0f1%3A0xf8e8f0f0f0f0f0f0!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 6,
    name: "Deepika Verma",
    code: "CUST006",
    phone: "6543210987",
    altPhone: "6543210988",
    place: "Delhi",
    treeCount: 110,
    lastHarvest: "2024-12-16",
    nextHarvest: "2025-02-14",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.0697806435507!2d77.20902!3d28.7041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd288f0f0f0f%3A0xf8e8f0f0f0f0f0f0!2sDelhi!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 7,
    name: "Suresh Kumar",
    code: "CUST007",
    phone: "5432109876",
    altPhone: "5432109877",
    place: "Kolkata",
    treeCount: 95,
    lastHarvest: "2024-12-20",
    nextHarvest: "2025-02-18",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.0697806435507!2d88.36389!3d22.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882f0f0f0f0f1%3A0xf8e8f0f0f0f0f0f0!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 8,
    name: "Neha Gupta",
    code: "CUST008",
    phone: "4321098765",
    altPhone: "4321098766",
    place: "Jaipur",
    treeCount: 160,
    lastHarvest: "2024-12-11",
    nextHarvest: "2025-02-09",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.0697806435507!2d75.78859!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4b0f0f0f0f0f%3A0xf8e8f0f0f0f0f0f0!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 9,
    name: "Arjun Singh",
    code: "CUST009",
    phone: "3210987654",
    altPhone: "3210987655",
    place: "Lucknow",
    treeCount: 140,
    lastHarvest: "2024-12-13",
    nextHarvest: "2025-02-11",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.0697806435507!2d80.94659!3d26.8467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399f0f0f0f0f0f0f%3A0xf8e8f0f0f0f0f0f0!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890",
  },
  {
    id: 10,
    name: "Meera Iyer",
    code: "CUST010",
    phone: "2109876543",
    altPhone: "2109876544",
    place: "Kochi",
    treeCount: 175,
    lastHarvest: "2024-12-17",
    nextHarvest: "2025-02-15",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0697806435507!2d76.29399!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0f0f0f0f0f0f0f%3A0xf8e8f0f0f0f0f0f0!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1234567890",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleAddCustomer = (data: any) => {
    if (editingId) {
      setCustomers(customers.map((c) => (c.id === editingId ? { ...data, id: editingId } : c)))
      setEditingId(null)
    } else {
      setCustomers([...customers, { ...data, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const handleEdit = (customer: (typeof customers)[0]) => {
    setSelectedCustomer(customer)
    setEditingId(customer.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  const handleShowMap = (customer: (typeof customers)[0]) => {
    setSelectedCustomer(customer)
    setIsMapModalOpen(true)
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.place.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (dateFilter.from && dateFilter.to) {
      return isDateInRange(customer.lastHarvest, dateFilter.from, dateFilter.to)
    }

    return true
  })

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-background to-background/95 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Customers Management</h1>
        <Button
          onClick={() => {
            setSelectedCustomer(null)
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} /> Add Customer
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-4 py-3">
          <Search size={20} className="text-muted-foreground" />
          <Input
            placeholder="Search by name, code, phone, or place..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 bg-transparent focus:outline-none focus-visible:ring-0"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 bg-card rounded-lg border border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter by Last Harvest:</span>
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

      <CustomersTable customers={filteredCustomers} onEdit={handleEdit} onDelete={handleDelete} onShowMap={handleShowMap} />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCustomer(null)
          setEditingId(null)
        }}
        onSubmit={handleAddCustomer}
        customer={selectedCustomer}
      />

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => {
          setIsMapModalOpen(false)
          setSelectedCustomer(null)
        }}
        customer={selectedCustomer}
      />
    </div>
  )
}
