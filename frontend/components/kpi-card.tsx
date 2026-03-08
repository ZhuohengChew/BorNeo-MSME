"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
}

export function KPICard({ title, value, change, changeType = "neutral", icon }: KPICardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 text-white">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-gray-500 mt-1">
            {changeType === "positive" && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
            {changeType === "negative" && <TrendingDown className="h-3 w-3 text-red-500 mr-1" />}
            <span
              className={
                changeType === "positive"
                  ? "text-green-600"
                  : changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-500"
              }
            >
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}