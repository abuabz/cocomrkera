"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/auth/login-page"
import Sidebar from "@/components/layout/sidebar"
import Dashboard from "@/components/dashboard/dashboard"
import CustomersPage from "@/components/customers/customers-page"
import EmployeesPage from "@/components/employees/employees-page"
import SalesPage from "@/components/sales/sales-page"
import SalaryPage from "@/components/salary/salary-page"
import OrdersPage from "@/components/orders/orders-page"
import FollowupPage from "@/components/followup/followup-page"
import ReportsPage from "@/components/reports/reports-page"
import EmployeeReports from "@/components/reports/employee-reports"
import { Menu, X } from "lucide-react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activePage, setActivePage] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
    setActivePage("dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center flex flex-col items-center gap-6">
          <div className="relative flex justify-center items-center w-24 h-24">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <img src="/Mr.kera icon.png" alt="Loading" className="w-12 h-12 object-contain animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-primary tracking-widest uppercase">MR. KERA</h2>
            <p className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase animate-pulse">Initializing System...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />
      case "customers":
        return <CustomersPage />
      case "employees":
        return <EmployeesPage />
      case "sales":
        return <SalesPage />
      case "salary":
        return <SalaryPage />
      case "orders":
        return <OrdersPage />
      case "followup":
        return <FollowupPage />
      case "reports":
        return <ReportsPage />
      case "employee-reports":
        return <EmployeeReports />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="hidden md:flex">
        <div className={`transition-all duration-300 ${desktopSidebarCollapsed ? "w-20" : "w-64"}`}>
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
            isMobile={false}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isCollapsed={desktopSidebarCollapsed}
            onCollapsedChange={setDesktopSidebarCollapsed}
          />
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 h-full bg-sidebar z-50 transition-transform duration-300 w-64 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
            isMobile={true}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {isMobile && (
          <div className="bg-sidebar text-sidebar-foreground shadow-md p-4 flex items-center justify-between md:hidden">
            <div className="flex items-center gap-2">
              <img src="/Mr.kera icon.png" alt="Logo" className="w-8 h-8 object-contain" />
              <h1 className="text-xl font-black tracking-tight">MR. KERA</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-sidebar-accent/30 rounded-lg transition-colors"
              title="Toggle menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        )}
        <div className="flex-1 overflow-auto">{renderPage()}</div>
      </main>
    </div>
  )
}
