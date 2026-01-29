"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDateDDMMYYYY } from "@/lib/date-utils"

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

interface SalesTableProps {
  sales: Sale[]
  onEdit: (sale: Sale) => void
  onDelete: (id: number) => void
}

export default function SalesTable({ sales, onEdit, onDelete }: SalesTableProps) {
  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Employees</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Trees</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Per Tree Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment Mode</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 text-sm text-card-foreground font-medium">{sale.customer}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{sale.employees.join(", ")}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{formatDateDDMMYYYY(sale.date)}</td>
                <td className="px-6 py-4 text-sm text-card-foreground font-semibold">{sale.totalTrees}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">₹{sale.perTreeAmount}</td>
                <td className="px-6 py-4 text-sm text-card-foreground font-bold text-secondary">
                  ₹{sale.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sale.paymentMode === "Cash" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {sale.paymentMode}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(sale)} className="gap-1">
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(sale.id)}
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
      {sales.length === 0 && (
        <div className="px-6 py-12 text-center text-muted-foreground">No sales found. Add one to get started.</div>
      )}
    </div>
  )
}
