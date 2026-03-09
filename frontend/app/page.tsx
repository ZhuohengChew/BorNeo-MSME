"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { KPICard } from "@/components/kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

import { useState, useEffect } from "react"
import axios from "axios"
import { useBusiness } from "@/lib/business-context"

// state initializers will live inside component

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const { activeBusiness, loading: bizLoading } = useBusiness()

  useEffect(() => {
    if (bizLoading) return
    if (!activeBusiness) { setLoading(false); return }
    const fetch = async () => {
      try {
        const res = await axios.get("/api/analytics")
        setAnalytics(res.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [activeBusiness, bizLoading])

  // Check if business profile is complete
  const isProfileComplete = !!activeBusiness

  // derive display data
  const revenueData = analytics?.monthly_trend || []
  // Reformat backend top_products (product, quantity_sold) to chart-friendly shape
  const topProductsData = (analytics?.top_products || []).map((p: any) => ({
    name: p.product,
    sales: p.quantity_sold,
  }))

  const kpiValues = {
    totalRevenue: analytics?.total_revenue || 0,
    estimatedProfit: analytics ? analytics.total_revenue * 0.3 : 0,
    totalProducts: analytics?.total_products || 0,
    totalSales: analytics?.total_sales || 0,
  }

  if (loading || bizLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isProfileComplete) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Business Registration Required</h2>
            <p className="text-yellow-700 mb-4">
              Please complete your business registration first to access analytics and insights.
            </p>
            <a
              href="/business"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Go to Business Registration
            </a>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your business overview.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Revenue"
            value={`RM ${kpiValues.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <KPICard
            title="Estimated Profit"
            value={`RM ${kpiValues.estimatedProfit.toLocaleString()}`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KPICard
            title="Total Products"
            value={`${kpiValues.totalProducts}`}
            icon={<Package className="h-4 w-4" />}
          />
          <KPICard
            title="Total Transactions"
            value={`${kpiValues.totalSales}`}
            icon={<ShoppingCart className="h-4 w-4" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <CardDescription>Revenue performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`RM ${value.toLocaleString()}`, "Revenue"]} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products by sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}