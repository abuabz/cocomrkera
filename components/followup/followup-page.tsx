"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FollowupTable from "./followup-table"
import FollowupModal from "./followup-modal"
import { Plus, Search, Calendar } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"

const SAMPLE_FOLLOWUPS = [
  {
    id: 1,
    name: "Priya Singh",
    phoneNumber: "+91 87654 32109",
    place: "Mumbai",
    treeCount: 300,
    date: "2024-12-20",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    phoneNumber: "+91 98765 43210",
    place: "Bangalore",
    treeCount: 250,
    date: "2024-12-19",
  },
  {
    id: 3,
    name: "Amit Patel",
    phoneNumber: "+91 98765 43212",
    place: "Pune",
    treeCount: 280,
    date: "2024-12-18",
  },
  {
    id: 4,
    name: "Anjali Sharma",
    phoneNumber: "+91 87654 32110",
    place: "Hyderabad",
    treeCount: 320,
    date: "2024-12-17",
  },
  {
    id: 5,
    name: "Vikram Reddy",
    phoneNumber: "+91 76543 21098",
    place: "Chennai",
    treeCount: 350,
    date: "2024-12-16",
  },
  {
    id: 6,
    name: "Deepika Verma",
    phoneNumber: "+91 65432 10987",
    place: "Delhi",
    treeCount: 200,
    date: "2024-12-15",
  },
  {
    id: 7,
    name: "Suresh Kumar",
    phoneNumber: "+91 54321 09876",
    place: "Kolkata",
    treeCount: 240,
    date: "2024-12-14",
  },
  {
    id: 8,
    name: "Neha Gupta",
    phoneNumber: "+91 43210 98765",
    place: "Jaipur",
    treeCount: 260,
    date: "2024-12-13",
  },
  {
    id: 9,
    name: "Arjun Singh",
    phoneNumber: "+91 32109 87654",
    place: "Lucknow",
    treeCount: 280,
    date: "2024-12-12",
  },
  {
    id: 10,
    name: "Meera Iyer",
    phoneNumber: "+91 21098 76543",
    place: "Kochi",
    treeCount: 310,
    date: "2024-12-11",
  },
]

export default function FollowupPage() {
  const [followups, setFollowups] = useState(SAMPLE_FOLLOWUPS)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFollowup, setSelectedFollowup] = useState<(typeof followups)[0] | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleAddFollowup = (data: any) => {
    if (editingId) {
      setFollowups(followups.map((f) => (f.id === editingId ? { ...data, id: editingId } : f)))
      setEditingId(null)
    } else {
      setFollowups([...followups, { ...data, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const handleEdit = (followup: (typeof followups)[0]) => {
    setSelectedFollowup(followup)
    setEditingId(followup.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setFollowups(followups.filter((f) => f.id !== id))
  }

  const filteredFollowups = followups.filter((followup) => {
    const matchesSearch =
      followup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followup.phoneNumber.includes(searchTerm) ||
      followup.place.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (dateFilter.from && dateFilter.to) {
      return isDateInRange(followup.date, dateFilter.from, dateFilter.to)
    }

    return true
  })

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-background to-background/95 min-h-screen w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Followup</h1>
          <p className="text-muted-foreground mt-1">Manage customer followups</p>
        </div>
        <Button
          onClick={() => {
            setSelectedFollowup(null)
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-full md:w-auto"
        >
          <Plus size={20} /> Add Followup
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

      <FollowupTable followups={filteredFollowups} onEdit={handleEdit} onDelete={handleDelete} />

      <FollowupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedFollowup(null)
          setEditingId(null)
        }}
        onSubmit={handleAddFollowup}
        followup={selectedFollowup}
      />
    </div>
  )
}
