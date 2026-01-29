"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface Employee {
  id: number
  name: string
  code: string
  contact: string
  altContact: string
  address: string
  photo: string
}

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  employee?: Employee | null
}

export default function EmployeeModal({ isOpen, onClose, onSubmit, employee }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    contact: "",
    altContact: "",
    address: "",
    photo: "/employee-photo.jpg",
  })

  const [photoPreview, setPhotoPreview] = useState("/employee-photo.jpg")

  useEffect(() => {
    if (employee) {
      setFormData(employee)
      setPhotoPreview(employee.photo)
    } else {
      setFormData({
        name: "",
        code: "",
        contact: "",
        altContact: "",
        address: "",
        photo: "/employee-photo.jpg",
      })
      setPhotoPreview("/employee-photo.jpg")
    }
  }, [employee, isOpen])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: any) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFormData((prev) => ({ ...prev, photo: result }))
        setPhotoPreview(result)
      }
      reader.readAsDataURL(file)
    }
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
          <h2 className="text-2xl font-bold text-card-foreground">{employee ? "Edit Employee" : "Add New Employee"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo Preview and Upload */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-border">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-primary">
              <img
                src={photoPreview || "/placeholder.svg"}
                alt="Employee preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <label className="text-sm font-medium text-foreground">Employee Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Employee Name *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Employee Code (Unique) *</label>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., EMP001"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contact Number *</label>
              <Input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Alternative Number</label>
              <Input
                type="tel"
                name="altContact"
                value={formData.altContact}
                onChange={handleChange}
                placeholder="Alternative phone"
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter employee address"
                rows={3}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              {employee ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
