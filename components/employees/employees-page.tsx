"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EmployeesTable from "./employees-table"
import EmployeeModal from "./employee-modal"
import { Plus, Search } from "lucide-react"

const SAMPLE_EMPLOYEES = [
  {
    id: 1,
    name: "Rajesh Kumar",
    code: "EMP001",
    contact: "9876543210",
    altContact: "9876543211",
    address: "Bangalore, Karnataka",
    photo: "/employee-photo.jpg",
  },
  {
    id: 2,
    name: "Priya Singh",
    code: "EMP002",
    contact: "9876543211",
    altContact: "9876543212",
    address: "Mumbai, Maharashtra",
    photo: "/employee-photo.jpg",
  },
  {
    id: 3,
    name: "Amit Patel",
    code: "EMP003",
    contact: "9876543212",
    altContact: "9876543213",
    address: "Pune, Maharashtra",
    photo: "/employee-photo.jpg",
  },
  {
    id: 4,
    name: "Anjali Sharma",
    code: "EMP004",
    contact: "8765432109",
    altContact: "8765432110",
    address: "Hyderabad, Telangana",
    photo: "/employee-photo.jpg",
  },
  {
    id: 5,
    name: "Vikram Reddy",
    code: "EMP005",
    contact: "7654321098",
    altContact: "7654321099",
    address: "Chennai, Tamil Nadu",
    photo: "/employee-photo.jpg",
  },
  {
    id: 6,
    name: "Deepika Verma",
    code: "EMP006",
    contact: "6543210987",
    altContact: "6543210988",
    address: "Delhi, India",
    photo: "/employee-photo.jpg",
  },
  {
    id: 7,
    name: "Suresh Kumar",
    code: "EMP007",
    contact: "5432109876",
    altContact: "5432109877",
    address: "Kolkata, West Bengal",
    photo: "/employee-photo.jpg",
  },
  {
    id: 8,
    name: "Neha Gupta",
    code: "EMP008",
    contact: "4321098765",
    altContact: "4321098766",
    address: "Jaipur, Rajasthan",
    photo: "/employee-photo.jpg",
  },
  {
    id: 9,
    name: "Arjun Singh",
    code: "EMP009",
    contact: "3210987654",
    altContact: "3210987655",
    address: "Lucknow, Uttar Pradesh",
    photo: "/employee-photo.jpg",
  },
  {
    id: 10,
    name: "Meera Iyer",
    code: "EMP010",
    contact: "2109876543",
    altContact: "2109876544",
    address: "Kochi, Kerala",
    photo: "/employee-photo.jpg",
  },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(SAMPLE_EMPLOYEES)
  const [searchTerm, setSearchTerm] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof employees)[0] | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleAddEmployee = (data: any) => {
    if (editingId) {
      setEmployees(employees.map((e) => (e.id === editingId ? { ...data, id: editingId } : e)))
      setEditingId(null)
    } else {
      setEmployees([...employees, { ...data, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const handleEdit = (employee: (typeof employees)[0]) => {
    setSelectedEmployee(employee)
    setEditingId(employee.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setEmployees(employees.filter((e) => e.id !== id))
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.contact.includes(searchTerm) ||
      employee.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-background to-background/95 w-full">
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

      <EmployeesTable employees={filteredEmployees} onEdit={handleEdit} onDelete={handleDelete} />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEmployee(null)
          setEditingId(null)
        }}
        onSubmit={handleAddEmployee}
        employee={selectedEmployee}
      />
    </div>
  )
}
