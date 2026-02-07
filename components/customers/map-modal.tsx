"use client"

import { Button } from "@/components/ui/button"
import { X, ExternalLink, MapPin, ZoomIn, Info, AlertTriangle } from "lucide-react"

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

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
}

export default function MapModal({ isOpen, onClose, customer }: MapModalProps) {
  if (!isOpen || !customer) return null

  // Simplified and robust link extraction
  const getEmbedUrl = (url: string) => {
    const zoom = 20
    const mapType = "k" // Satellite

    const searchQuery = `${customer.name || ""} ${customer.place || ""}`.trim()
    const encodedSearch = encodeURIComponent(searchQuery)

    // Check for coordinates (@lat,lng)
    const coordMatch = url?.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url?.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (coordMatch) {
      const lat = coordMatch[1]
      const lng = coordMatch[2]
      return `https://maps.google.com/maps?q=${lat},${lng}&t=${mapType}&z=${zoom}&output=embed`
    }

    // Handle short links
    if (url?.includes("goo.gl") || url?.includes("maps.app.goo.gl")) {
      return `https://maps.google.com/maps?q=${encodedSearch}&t=${mapType}&z=${zoom}&output=embed`
    }

    // Handle iframe src
    const srcMatch = url?.match(/src="([^"]+)"/)
    if (srcMatch) return srcMatch[1]

    // Fallback
    const finalQuery = url ? encodeURIComponent(url) : encodedSearch
    return `https://maps.google.com/maps?q=${finalQuery}&t=${mapType}&z=${zoom}&output=embed`
  }

  const mapSrc = getEmbedUrl(customer.mapUrl || "")

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-lg shadow-2xl border border-border w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        {/* Simple Traditional Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-card-foreground">
              Location: {customer.name} ({customer.place})
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
            <X size={28} />
          </button>
        </div>

        {/* Map View */}
        <div className="flex-1 relative bg-muted">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={mapSrc}
            allowFullScreen
            loading="lazy"
            title="Google Maps"
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Footer with primary button */}
        <div className="p-4 border-t border-border bg-card flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
            <Info size={16} className="text-primary" />
            Showing satellite view for better property identification.
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
              <a href={customer.mapUrl || `https://www.google.com/maps/search/${encodeURIComponent(customer.name + " " + customer.place)}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} className="mr-2" />
                OPEN IN GOOGLE MAPS APP
              </a>
            </Button>
            <Button onClick={onClose} variant="outline" className="px-8 font-bold">
              CLOSE
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
