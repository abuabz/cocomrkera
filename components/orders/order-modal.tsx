"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Order {
  id: number
  name: string
  phoneNumber: string
  place: string
  treeCount: number
  date: string
}

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Order, "id">) => void
  order?: Order | null
}

export default function OrderModal({ isOpen, onClose, onSubmit, order }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    place: "",
    treeCount: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (order) {
      setFormData({
        name: order.name,
        phoneNumber: order.phoneNumber,
        place: order.place,
        treeCount: String(order.treeCount),
        date: order.date,
      })
    } else {
      setFormData({
        name: "",
        phoneNumber: "",
        place: "",
        treeCount: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }, [order, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      treeCount: parseInt(formData.treeCount),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">{order ? "Edit Order" : "Add New Order"}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Customer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Place *</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Location"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Tree Count *</label>
            <input
              type="number"
              name="treeCount"
              value={formData.treeCount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {order ? "Update" : "Add"} Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
