"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDateDDMMYYYY } from "@/lib/date-utils"

interface Followup {
  id: number
  name: string
  phoneNumber: string
  place: string
  treeCount: number
  date: string
}

interface FollowupTableProps {
  followups: Followup[]
  onEdit: (followup: Followup) => void
  onDelete: (id: number) => void
}

export default function FollowupTable({ followups, onEdit, onDelete }: FollowupTableProps) {
  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/10 border-b border-border">
            <tr>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground">Phone Number</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground">Place</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground">Tree Count</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {followups.map((followup) => (
              <tr key={followup.id} className="hover:bg-primary/5 transition-colors">
                <td className="px-4 md:px-6 py-4 text-sm text-card-foreground font-medium">{followup.name}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-muted-foreground">{followup.phoneNumber}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-muted-foreground">{followup.place}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-card-foreground font-semibold">{followup.treeCount}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-muted-foreground">
                  {formatDateDDMMYYYY(followup.date)}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(followup)} className="gap-1">
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(followup.id)}
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
      {followups.length === 0 && (
        <div className="px-6 py-12 text-center text-muted-foreground">No followups found. Add one to get started.</div>
      )}
    </div>
  )
}
