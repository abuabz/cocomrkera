"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Employee {
  id: number
  name: string
  code: string
  contact: string
  altContact: string
  address: string
  photo: string
}

interface EmployeesTableProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (id: number) => void
}

export default function EmployeesTable({ employees, onEdit, onDelete }: EmployeesTableProps) {
  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Photo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <img
                      src={employee.photo || "/placeholder.svg"}
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground font-medium">{employee.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{employee.code}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{employee.contact}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{employee.address}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(employee)} className="gap-1">
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(employee.id)}
                      className="gap-1 border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {employees.length === 0 && (
        <div className="px-6 py-12 text-center text-muted-foreground">No employees found. Add one to get started.</div>
      )}
    </div>
  )
}
