"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface Customer {
  id: string
  name: string
  code: string
  phone: string
  altPhone: string
  place: string
  treeCount: number
  lastHarvest: string
  nextHarvest: string
  mapUrl?: string
}

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  customer?: Customer | null
  existingCustomers?: Customer[]
}

export default function CustomerModal({
  isOpen,
  onClose,
  onSubmit,
  customer,
  existingCustomers = []
}: CustomerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    altPhone: "",
    place: "",
    treeCount: "",
    lastHarvest: "",
    nextHarvest: "",
    mapUrl: "",
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        code: customer.code || "",
        phone: customer.phone || "",
        altPhone: customer.altPhone || "",
        place: customer.place || "",
        treeCount: customer.treeCount !== undefined ? String(customer.treeCount) : "",
        lastHarvest: customer.lastHarvest ? new Date(customer.lastHarvest).toISOString().split("T")[0] : "",
        nextHarvest: customer.nextHarvest ? new Date(customer.nextHarvest).toISOString().split("T")[0] : "",
        mapUrl: customer.mapUrl || "",
      })
    } else {
      // Auto-generate next code
      const nextCode = `CUST-${String(existingCustomers.length + 1).padStart(3, "0")}`

      setFormData({
        name: "",
        code: nextCode,
        phone: "",
        altPhone: "",
        place: "",
        treeCount: "",
        lastHarvest: "",
        nextHarvest: "",
        mapUrl: "",
      })
    }
  }, [customer, isOpen, existingCustomers.length])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === "lastHarvest" && value) {
        const lastDate = new Date(value)
        lastDate.setDate(lastDate.getDate() + 60)
        updated.nextHarvest = lastDate.toISOString().split("T")[0]
      }
      return updated
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-card-foreground">{customer ? "Edit Customer" : "Add New Customer"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Customer Name *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Customer Code (Unique) *</label>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., CUST001"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Alternative Phone Number</label>
              <Input
                type="tel"
                name="altPhone"
                value={formData.altPhone}
                onChange={handleChange}
                placeholder="Alternative phone"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Place *</label>
              <Input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="City/Area"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tree Count</label>
              <Input
                type="number"
                name="treeCount"
                value={formData.treeCount}
                onChange={handleChange}
                placeholder="Number of trees"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Last Harvest Date</label>
              <Input
                type="date"
                name="lastHarvest"
                value={formData.lastHarvest}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Next Harvest Date (Auto-calculated)
              </label>
              <Input
                type="date"
                name="nextHarvest"
                value={formData.nextHarvest}
                onChange={handleChange}
                className="w-full"
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Google Map Embed URL</label>
              <Input
                type="text"
                name="mapUrl"
                value={formData.mapUrl}
                onChange={handleChange}
                placeholder="Paste link (e.g. google.com/maps/@12.3,76.5,18z) or Embed code"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              {customer ? "Update Customer" : "Add Customer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
