"use client"

import { Users, UserCheck, ShoppingCart, FileText, Home, LogOut, ChevronLeft, ChevronRight, Layers, Phone, Banknote } from "lucide-react"

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
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "customers", label: "Customers", icon: Users },
    { id: "employees", label: "Employees", icon: UserCheck },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "salary", label: "Salary", icon: Banknote },
    { id: "orders", label: "Orders", icon: Layers },
    { id: "followup", label: "Followup", icon: Phone },
    { id: "reports", label: "Reports", icon: FileText },
  ]

  const handleMenuClick = (pageId: string) => {
    setActivePage(pageId)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <aside className="bg-sidebar text-sidebar-foreground shadow-lg flex flex-col h-full w-full relative">
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-bold text-white">CPBMS</h1>
            <p className="text-sm text-sidebar-foreground/70">Coconut Plucking</p>
          </div>
        )}

        {!isMobile && (
          <button
            onClick={() => onCollapsedChange?.(!isCollapsed)}
            className="p-1 hover:bg-sidebar-accent/30 rounded-lg transition-colors ml-auto"
            title={isCollapsed ? "Expand menu" : "Collapse menu"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}

        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-sidebar-accent/30 rounded-lg transition-colors"
            title="Close menu"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/30"
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
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-red-600/20 transition-colors"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
