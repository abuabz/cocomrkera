"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FollowupTable from "./followup-table"
import FollowupModal from "./followup-modal"
import ConfirmModal from "@/components/ui/confirm-modal"
import { Plus, Search, Calendar } from "lucide-react"
import { isDateInRange } from "@/lib/date-utils"
import { followupsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function FollowupPage() {
  const [followups, setFollowups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedFollowup, setSelectedFollowup] = useState<any | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchFollowups = async () => {
    try {
      setLoading(true)
      const response = await followupsApi.getAll()
      const data = (response.data || []).map((item: any) => ({
        ...item,
        id: item.id || item._id
      }))
      setFollowups(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch followups",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFollowups()
  }, [])

  const handleAddFollowup = async (data: any) => {
    try {
      if (editingId) {
        await followupsApi.update(editingId, data)
        toast({ title: "Success", description: "Followup updated successfully" })
      } else {
        await followupsApi.create(data)
        toast({ title: "Success", description: "Followup added successfully" })
      }
      fetchFollowups()
      setIsModalOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (followup: any) => {
    setSelectedFollowup(followup)
    setEditingId(followup.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    setEditingId(id)
    setIsConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!editingId) return
    try {
      await followupsApi.delete(editingId)
      toast({ title: "Success", description: "Followup deleted successfully" })
      fetchFollowups()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete followup",
        variant: "destructive",
      })
    } finally {
      setIsConfirmOpen(false)
      setEditingId(null)
    }
  }

  const filteredFollowups = followups.filter((followup) => {
    const s = searchTerm.toLowerCase()
    const matchesSearch =
      (followup.name?.toLowerCase() || "").includes(s) ||
      (followup.phoneNumber || "").includes(searchTerm) ||
      (followup.place?.toLowerCase() || "").includes(s)

    if (!matchesSearch) return false

    if (dateFilter.from && dateFilter.to) {
      return isDateInRange(followup.date, dateFilter.from, dateFilter.to)
    }

    return true
  })

  return (
    <div className="p-4 md:p-8 bg-linear-to-br from-background to-background/95 min-h-screen w-full">
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

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">Loading followups...</div>
      ) : (
        <FollowupTable followups={filteredFollowups} onEdit={handleEdit} onDelete={handleDelete as any} />
      )}

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

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Followup"
        message="Are you sure you want to delete this followup record? This action cannot be undone."
      />
    </div>
  )
}
