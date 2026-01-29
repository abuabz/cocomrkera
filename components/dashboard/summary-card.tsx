import { Users, UserCheck, TrendingUp, Leaf } from "lucide-react"

interface SummaryCardProps {
  title: string
  value: string
  icon: "users" | "users-check" | "trending-up" | "leaf"
  trend: string
  color: "primary" | "secondary"
}

const iconMap = {
  users: Users,
  "users-check": UserCheck,
  "trending-up": TrendingUp,
  leaf: Leaf,
}

export default function SummaryCard({ title, value, icon, trend, color }: SummaryCardProps) {
  const Icon = iconMap[icon]
  const bgColor = color === "primary" ? "bg-primary" : "bg-secondary"

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`${bgColor} p-2 rounded-lg`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-card-foreground">{value}</p>
        <p className={`text-sm font-semibold ${color === "primary" ? "text-primary" : "text-secondary"}`}>
          {trend} from last month
        </p>
      </div>
    </div>
  )
}
