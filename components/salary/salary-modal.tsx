"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { employeesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface SalaryModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    salary?: any | null
}

export default function SalaryModal({ isOpen, onClose, onSubmit, salary }: SalaryModalProps) {
    const [formData, setFormData] = useState({
        employee: "",
        amount: "",
        paymentMethod: "Cash",
        paymentDate: new Date().toISOString().split("T")[0],
        remarks: "",
    })

    const [employees, setEmployees] = useState<any[]>([])
    const { toast } = useToast()

    useEffect(() => {
        if (isOpen) {
            const fetchEmployees = async () => {
                try {
                    const response = await employeesApi.getAll()
                    setEmployees(response.data || [])
                } catch (error: any) {
                    toast({ title: "Error", description: "Failed to load employees", variant: "destructive" })
                }
            }
            fetchEmployees()
        }
    }, [isOpen])

    useEffect(() => {
        if (salary) {
            setFormData({
                employee: salary.employee?._id || salary.employee?.id || salary.employee || "",
                amount: salary.amount.toString(),
                paymentMethod: salary.paymentMethod || "Cash",
                paymentDate: salary.paymentDate ? salary.paymentDate.split("T")[0] : new Date().toISOString().split("T")[0],
                remarks: salary.remarks || "",
            })
        } else {
            setFormData({
                employee: "",
                amount: "",
                paymentMethod: "Cash",
                paymentDate: new Date().toISOString().split("T")[0],
                remarks: "",
            })
        }
    }, [salary, isOpen])

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            amount: Number(formData.amount),
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card rounded-lg shadow-xl border border-border max-w-md w-full animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-card-foreground">{salary ? "Edit Salary" : "Add Salary"}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Employee *</label>
                        <select
                            name="employee"
                            value={formData.employee}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">Select an employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id || emp._id} value={emp.id || emp._id}>
                                    {emp.name} ({emp.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Salary Amount (₹) *</label>
                        <Input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            required
                            min="0"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Payment Method *</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Payment Date *</label>
                        <Input
                            type="date"
                            name="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleChange}
                            required
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Remarks</label>
                        <Input
                            type="text"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Optional notes"
                            className="w-full"
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-6">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white"
                            disabled={!formData.employee || !formData.amount}
                        >
                            {salary ? "Update Salary" : "Record Salary"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
