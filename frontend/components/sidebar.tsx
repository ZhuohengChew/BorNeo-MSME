"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useBusiness } from "@/lib/business-context"
import {
  BarChart3,
  Building2,
  CreditCard,
  ChevronDown,
  Check,
  Home,
  LineChart,
  Package,
  Plus,
  TrendingUp,
  Upload,
  User,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Business Registration", href: "/business", icon: Building2 },
  { name: "POS System", href: "/pos", icon: Package },
  { name: "CSV Upload", href: "/upload", icon: Upload },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Demand Forecast", href: "/forecast", icon: TrendingUp },
  { name: "Simulation", href: "/simulation", icon: LineChart },
  { name: "Loan Center", href: "/loan", icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const { activeBusiness, businesses, switchBusiness } = useBusiness()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <span className="text-lg font-bold text-white">B</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">BorNeo</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wide">MSME Intelligence</p>
          </div>
        </div>
      </div>

      {/* Business Switcher */}
      {businesses.length > 0 && (
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="relative">
            <button
              onClick={() => setSwitcherOpen(!switcherOpen)}
              className="flex w-full items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="h-4 w-4 shrink-0 text-blue-600" />
                <span className="truncate">{activeBusiness?.business_name ?? "Select Business"}</span>
              </div>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-blue-600 transition-transform", switcherOpen && "rotate-180")} />
            </button>

            {switcherOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="py-1 max-h-48 overflow-y-auto">
                  {businesses.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { switchBusiness(b.id); setSwitcherOpen(false); }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                        b.id === activeBusiness?.id ? "text-blue-700 font-medium bg-blue-50/50" : "text-gray-700"
                      )}
                    >
                      {b.id === activeBusiness?.id ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                      ) : (
                        <span className="w-3.5" />
                      )}
                      <span className="truncate">{b.business_name}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100">
                  <Link
                    href="/business"
                    onClick={() => setSwitcherOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Register New Business
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Business Info */}
      <div className="border-t border-gray-200 p-4">
        <Link href="/profile" className="block">
          <div className="rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Business Profile
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">
              {activeBusiness?.business_name || "Not Registered"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {activeBusiness?.business_type || "Complete Registration"}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}