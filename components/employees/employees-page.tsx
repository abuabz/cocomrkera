"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EmployeesTable from "./employees-table"
import EmployeeModal from "./employee-modal"
import ConfirmModal from "@/components/ui/confirm-modal"
import { Plus, Search } from "lucide-react"
import { employeesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await employeesApi.getAll()
      const data = (response.data || []).map((item: any) => ({
        ...item,
        id: item.id || item._id
      }))
      setEmployees(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch employees",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleAddEmployee = async (data: any) => {
    try {
      if (editingId) {
        await employeesApi.update(editingId, data)
        toast({ title: "Success", description: "Employee updated successfully" })
      } else {
        await employeesApi.create(data)
        toast({ title: "Success", description: "Employee added successfully" })
      }
      fetchEmployees()
      setIsModalOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee)
    setEditingId(employee.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    setEditingId(id)
    setIsConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!editingId) return
    try {
      await employeesApi.delete(editingId)
      toast({ title: "Success", description: "Employee deleted successfully" })
      fetchEmployees()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive",
      })
    } finally {
      setIsConfirmOpen(false)
      setEditingId(null)
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const s = searchTerm.toLowerCase()
    return (
      (employee.name?.toLowerCase() || "").includes(s) ||
      (employee.code?.toLowerCase() || "").includes(s) ||
      (employee.contact || "").includes(searchTerm) ||
      (employee.address?.toLowerCase() || "").includes(s)
    )
  })

  return (
    <div className="p-4 md:p-8 bg-linear-to-br from-background to-background/95 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Employees Management</h1>
        <Button
          onClick={() => {
            setSelectedEmployee(null)
            setEditingId(null)
            setIsModalOpen(true)
          }}
          className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} /> Add Employee
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-2 bg-card rounded-lg border border-border px-4 py-3">
        <Search size={20} className="text-muted-foreground" />
        <Input
          placeholder="Search by name, code, contact, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 bg-transparent focus:outline-none focus-visible:ring-0"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">Loading employees...</div>
      ) : (
        <EmployeesTable employees={filteredEmployees} onEdit={handleEdit} onDelete={handleDelete as any} />
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEmployee(null)
          setEditingId(null)
        }}
        onSubmit={handleAddEmployee}
        employee={selectedEmployee}
        existingEmployees={employees}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  )
}
