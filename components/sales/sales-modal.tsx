"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { X } from "lucide-react"
import { customersApi, employeesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface SalesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  sale?: any | null
}

export default function SalesModal({ isOpen, onClose, onSubmit, sale }: SalesModalProps) {
  const [formData, setFormData] = useState({
    customerId: "",
    employees: [] as string[],
    saleDate: new Date().toISOString().split("T")[0],
    perTreeAmount: 50,
    paymentMode: "Cash",
  })

  const [treeCounts, setTreeCounts] = useState<number[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [customersRes, employeesRes] = await Promise.all([
            customersApi.getAll(),
            employeesApi.getAll()
          ])
          setCustomers(customersRes.data || [])
          const mappedEmployees = (employeesRes.data || []).map((emp: any) => ({
            ...emp,
            id: emp.id || emp._id
          }))
          setEmployees(mappedEmployees)
        } catch (error: any) {
          toast({ title: "Error", description: "Failed to load options", variant: "destructive" })
        }
      }
      fetchData()
    }
  }, [isOpen])

  useEffect(() => {
    if (sale) {
      setFormData({
        customerId: sale.customerId?._id || sale.customerId?.id || sale.customerId || "",
        employees: (sale.employees || []).map((e: any) => e._id || e.id || e),
        saleDate: sale.saleDate ? sale.saleDate.split("T")[0] : new Date().toISOString().split("T")[0],
        perTreeAmount: sale.perTreeAmount,
        paymentMode: sale.paymentMode,
      })
      setTreeCounts(sale.treesHarvested || [])
    } else {
      setFormData({
        customerId: "",
        employees: [],
        saleDate: new Date().toISOString().split("T")[0],
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
      customerId: formData.customerId,
      employees: formData.employees,
      saleDate: formData.saleDate,
      treesHarvested: treeCounts,
      totalTrees,
      perTreeAmount: formData.perTreeAmount,
      totalAmount,
      paymentMode: formData.paymentMode,
    })
  }

  if (!isOpen) return null

  const employeeOptions = employees.map(emp => ({
    label: emp.name,
    value: emp.id || emp._id
  }))

  const getEmployeeName = (id: string) => {
    return employees.find(emp => (emp.id || emp._id) === id)?.name || "Unknown"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
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
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Employees *</label>
            <MultiSelect
              options={employeeOptions}
              selected={formData.employees}
              onSelectedChange={(selected) =>
                setFormData((prev) => {
                  const newTreeCounts = new Array(selected.length).fill(0)
                  // Try to preserve existing counts if possible
                  selected.forEach((id, idx) => {
                    const oldIdx = prev.employees.indexOf(id)
                    if (oldIdx !== -1) {
                      newTreeCounts[idx] = treeCounts[oldIdx]
                    }
                  })
                  setTreeCounts(newTreeCounts)
                  return { ...prev, employees: selected }
                })
              }
              placeholder="Choose employees..."
            />
          </div>

          {formData.employees.length > 0 && (
            <div className="space-y-3 bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3">Tree Count for Each Employee</h3>
              {formData.employees.map((empId, index) => (
                <div key={index} className="flex items-center gap-3">
                  <label className="flex-1 text-sm text-foreground">{getEmployeeName(empId)}</label>
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
                name="saleDate"
                value={formData.saleDate}
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
                <option value="Bank Transfer">Bank Transfer</option>
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
              disabled={!formData.customerId || formData.employees.length === 0}
            >
              {sale ? "Update Sales" : "Add Sales"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
