"use client"

import { Users, UserCheck, ShoppingCart, FileText, Home, LogOut, ChevronLeft, ChevronRight, Layers, Phone, Banknote, TrendingUp, Database, ShieldAlert, PiggyBank, Wallet } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
  onLogout: () => void
  isMobile: boolean
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export default function Sidebar({
  activePage,
  setActivePage,
  onLogout,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  isCollapsed = false,
  onCollapsedChange,
}: SidebarProps) {
  const { user } = useAuth()
  
  const allMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "customers", label: "Customers", icon: Users },
    { id: "employees", label: "Employees", icon: UserCheck },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "salary", label: "Salary", icon: Banknote },
    { id: "orders", label: "Orders", icon: Layers },
    { id: "followup", label: "Followup", icon: Phone },
    { id: "employee-reports", label: "Work Reports", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "users", label: "Users", icon: ShieldAlert },
    { id: "savings", label: "Savings", icon: PiggyBank },
    { id: "expenses", label: "Expenses", icon: Wallet },
    { id: "backup", label: "Data Management", icon: Database },
  ]

  // Filter menu items based on user role and permissions
  const menuItems = allMenuItems.filter(item => {
      if (!user) return false
      if (user.role === 'admin') return true
      return user.permissions.includes(item.id)
  })

  const handleMenuClick = (pageId: string) => {
    setActivePage(pageId)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <aside className="bg-sidebar text-sidebar-foreground shadow-lg flex flex-col h-full w-full relative">
      <div className={`p-6 border-b border-sidebar-border flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
        <img src="/Mr.kera icon.png" alt="Logo" className={`${isCollapsed ? "w-8 h-8" : "w-10 h-10"} object-contain`} />
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden transition-all duration-300">
            <h1 className="text-xl font-black text-white whitespace-nowrap italic">MR. KERA</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-sidebar-foreground/50 leading-none">Management</p>
          </div>
        )}

        {!isMobile && !isCollapsed && (
          <button
            onClick={() => onCollapsedChange?.(!isCollapsed)}
            className="p-1 hover:bg-sidebar-accent/30 rounded-lg transition-colors ml-auto text-white/50"
            title="Collapse menu"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-sidebar-accent/30 rounded-lg transition-colors text-white/50"
            title="Close menu"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={() => onCollapsedChange?.(false)}
            className="absolute -right-3 top-20 bg-primary text-white p-1 rounded-full shadow-lg border border-white/10"
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? "bg-secondary text-white shadow-lg shadow-black/20 translate-x-1"
                : "text-sidebar-foreground hover:bg-white/5"
                }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
          {user && !isCollapsed && (
              <div className="px-4 py-2 mb-2 bg-white/5 rounded-lg">
                  <p className="text-[10px] uppercase font-black text-primary truncate">{user.username}</p>
                  <p className="text-[8px] uppercase font-bold text-sidebar-foreground/50 truncate tracking-widest">{user.role}</p>
              </div>
          )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-red-600/20 transition-colors group"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} className="shrink-0 group-hover:text-red-500 transition-colors" />
          {!isCollapsed && <span className="font-medium group-hover:text-red-500 transition-colors">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
