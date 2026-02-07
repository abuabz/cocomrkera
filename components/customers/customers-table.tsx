"use client"

import { Edit, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDateDDMMYYYY } from "@/lib/date-utils"

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

interface CustomersTableProps {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (id: string) => void
}

export default function CustomersTable({ customers, onEdit, onDelete }: CustomersTableProps) {
  const getGoogleMapsUrl = (customer: Customer) => {
    if (customer.mapUrl) {
      // If it's an iframe snippet, extract the URL
      const srcMatch = customer.mapUrl.match(/src="([^"]+)"/)
      if (srcMatch) return srcMatch[1].replace("/embed", "")
      return customer.mapUrl
    }

    // Fallback: Search by Name + Place
    const query = encodeURIComponent(`${customer.name} ${customer.place}`)
    return `https://www.google.com/maps/search/${query}`
  }

  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Place</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Trees</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Harvest</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Next Harvest</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 text-sm text-card-foreground font-medium">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{customer.code}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{customer.phone}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{customer.place}</td>
                <td className="px-6 py-4 text-sm text-card-foreground font-semibold">{customer.treeCount}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDateDDMMYYYY(customer.lastHarvest)}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDateDDMMYYYY(customer.nextHarvest)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1 text-secondary border-secondary hover:bg-secondary/10 cursor-pointer"
                    >
                      <a href={getGoogleMapsUrl(customer)} target="_blank" rel="noopener noreferrer">
                        <MapPin size={16} /> Map
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(customer)} className="gap-1">
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(customer.id)}
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
      {customers.length === 0 && (
        <div className="px-6 py-12 text-center text-muted-foreground">No customers found. Add one to get started.</div>
      )}
    </div>
  )
}
