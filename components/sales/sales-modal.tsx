"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { X } from "lucide-react"

interface Sale {
  id: number
  customer: string
  employees: string[]
  date: string
  trees: number[]
  totalTrees: number
  perTreeAmount: number
  totalAmount: number
  paymentMode: string
}

interface SalesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  sale?: Sale | null
}

const mockCustomers = ["Rajesh Kumar", "Priya Singh", "Amit Patel", "Deepak Verma"]
const mockEmployees = ["Priya Singh", "Amit Patel", "Deepak Verma", "Neha Sharma", "Ravi Kumar"]

export default function SalesModal({ isOpen, onClose, onSubmit, sale }: SalesModalProps) {
  const [formData, setFormData] = useState({
    customer: "",
    employees: [] as string[],
    date: new Date().toISOString().split("T")[0],
    perTreeAmount: 50,
    paymentMode: "Cash",
  })

  const [treeCounts, setTreeCounts] = useState<number[]>([])

  useEffect(() => {
    if (sale) {
      setFormData({
        customer: sale.customer,
        employees: sale.employees,
        date: sale.date,
        perTreeAmount: sale.perTreeAmount,
        paymentMode: sale.paymentMode,
      })
      setTreeCounts(sale.trees)
    } else {
      setFormData({
        customer: "",
        employees: [],
        date: new Date().toISOString().split("T")[0],
        perTreeAmount: 50,
        paymentMode: "Cash",
      })
      setTreeCounts([])
    }
  }, [sale, isOpen])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmployeeToggle = (employee: string) => {
    setFormData((prev) => {
      const updated = prev.employees.includes(employee)
        ? prev.employees.filter((e) => e !== employee)
        : [...prev.employees, employee]
      setTreeCounts(new Array(updated.length).fill(0))
      return { ...prev, employees: updated }
    })
  }

  const handleTreeCountChange = (index: number, value: string) => {
    const updated = [...treeCounts]
    updated[index] = Number.parseInt(value) || 0
    setTreeCounts(updated)
  }

  const totalTrees = treeCounts.reduce((a, b) => a + b, 0)
  const totalAmount = totalTrees * formData.perTreeAmount

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit({
      customer: formData.customer,
      employees: formData.employees,
      date: formData.date,
      trees: treeCounts,
      totalTrees,
      perTreeAmount: formData.perTreeAmount,
      totalAmount,
      paymentMode: formData.paymentMode,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-card-foreground">{sale ? "Edit Sales" : "Add New Sales"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Customer *</label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
            >
              <option value="">Select a customer</option>
              {mockCustomers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Employees *</label>
            <MultiSelect
              options={mockEmployees}
              selected={formData.employees}
              onSelectedChange={(selected) =>
                setFormData((prev) => {
                  setTreeCounts(new Array(selected.length).fill(0))
                  return { ...prev, employees: selected }
                })
              }
              placeholder="Choose employees..."
            />
          </div>

          {formData.employees.length > 0 && (
            <div className="space-y-3 bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3">Tree Count for Each Employee</h3>
              {formData.employees.map((emp, index) => (
                <div key={index} className="flex items-center gap-3">
                  <label className="flex-1 text-sm text-foreground">{emp}</label>
                  <Input
                    type="number"
                    value={treeCounts[index] || ""}
                    onChange={(e) => handleTreeCountChange(index, e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-24"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date *</label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Per Tree Amount (₹) *</label>
              <Input
                type="number"
                name="perTreeAmount"
                value={formData.perTreeAmount}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
              >
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          {totalTrees > 0 && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Total Trees:</span>
                <span className="font-bold text-foreground">{totalTrees}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Per Tree Amount:</span>
                <span className="font-bold text-foreground">₹{formData.perTreeAmount}</span>
              </div>
              <div className="flex justify-between text-lg border-t border-secondary/30 pt-2 mt-2">
                <span className="text-foreground font-semibold">Total Amount:</span>
                <span className="font-bold text-secondary">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={!formData.customer || formData.employees.length === 0}
            >
              {sale ? "Update Sales" : "Add Sales"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
