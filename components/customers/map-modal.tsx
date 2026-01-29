"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Customer {
  id: number
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

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
}

export default function MapModal({ isOpen, onClose, customer }: MapModalProps) {
  if (!isOpen || !customer) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-card-foreground">
            Location: {customer.name} - {customer.place}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-6">
          {customer.mapUrl ? (
            <iframe
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: "0.5rem" }}
              src={customer.mapUrl}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
              <p className="text-muted-foreground">No map URL configured for this customer</p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-border">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-white">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
