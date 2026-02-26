import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export function TableSkeletonLoader() {
    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-primary/5 p-4 flex flex-col gap-4">
            {/* Table Header Simulation */}
            <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-24 bg-primary/10" />
                ))}
            </div>

            {/* Table Rows */}
            <div className="flex flex-col gap-3 pt-2">
                {[...Array(5)].map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-between items-center py-2">
                        <Skeleton className="h-10 w-10 rounded-full bg-primary/5" />
                        <Skeleton className="h-4 w-32 bg-primary/5" />
                        <Skeleton className="h-4 w-20 bg-primary/5" />
                        <Skeleton className="h-4 w-24 bg-primary/5" />
                        <Skeleton className="h-6 w-16 rounded-full bg-primary/10" />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center pt-4">
                <Loader2 className="h-6 w-6 text-primary/40 animate-spin" />
            </div>
        </div>
    )
}
