"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import axios from "axios"
import { useBusiness } from "@/lib/business-context"

interface AnalyticsData {
  total_revenue: number
  monthly_trend: Array<{ date: string; revenue: number }>
  top_products: Array<{ product: string; quantity_sold: number }>
  total_products: number
  total_sales: number
  product_performance?: Array<{
    product: string
    category: string
    qty_sold: number
    total_revenue: number
    total_cost: number
    total_profit: number
    profit_margin_: number
    price_unit: number
    cost_unit: number
    stock: number
  }>
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { activeBusiness, loading: bizLoading } = useBusiness()

  useEffect(() => {
    if (bizLoading) return
    if (!activeBusiness) { setLoading(false); return }
    const fetchData = async () => {
      try {
        const [analyticsRes, anomaliesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/analytics"),
          axios.get("http://localhost:8000/api/anomalies")
        ])
        setAnalytics(analyticsRes.data)
        setAnomalies(anomaliesRes.data.anomalies || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeBusiness, bizLoading])

  const isProfileComplete = !!activeBusiness

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

  // Mock data for pie chart
  // Mock data for pie chart
  const revenueComposition = [
    { name: "Product A", value: 35, color: "#3b82f6" },
    { name: "Product B", value: 25, color: "#8b5cf6" },
    { name: "Product C", value: 20, color: "#06b6d4" },
    { name: "Product D", value: 12, color: "#10b981" },
    { name: "Others", value: 8, color: "#f59e0b" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Deep insights into your business performance.</p>
        </div>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend Analysis</CardTitle>
            <CardDescription>Monthly revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analytics?.monthly_trend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by quantity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.top_products?.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <span className="font-medium">{product.product}</span>
                    </div>
                    <span className="text-gray-600">{product.quantity_sold} sold</span>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">No sales data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Composition */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Composition</CardTitle>
              <CardDescription>Revenue breakdown by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueComposition}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {revenueComposition.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Performance Analysis */}
        {analytics?.product_performance && analytics.product_performance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Analysis</CardTitle>
              <CardDescription>Detailed profitability analysis for each product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-right py-2">Qty Sold</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Cost</th>
                      <th className="text-right py-2">Profit</th>
                      <th className="text-right py-2">Margin %</th>
                      <th className="text-right py-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.product_performance.map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">
                          <div>
                            <div className="font-medium">{product.product}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                        </td>
                        <td className="text-right py-2">{product.qty_sold}</td>
                        <td className="text-right py-2">RM{product.total_revenue.toFixed(2)}</td>
                        <td className="text-right py-2">RM{product.total_cost.toFixed(2)}</td>
                        <td className={`text-right py-2 ${product.total_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          RM{product.total_profit.toFixed(2)}
                        </td>
                        <td className={`text-right py-2 ${product.profit_margin_ >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.profit_margin_}%
                        </td>
                        <td className="text-right py-2">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stock Recommendations */}
        {analytics?.product_performance && analytics.product_performance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📦 Inventory Optimization - Stock Recommendations</CardTitle>
              <CardDescription>AI predicts product demand to suggest optimal stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.product_performance.map((product, index) => {
                  // Simple recommendation logic: suggest reorder if stock is low
                  const recommendedStock = Math.max(product.qty_sold * 1.2, 10) // 20% buffer, min 10
                  const needsReorder = product.stock < recommendedStock * 0.5
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{product.product}</div>
                        <div className="text-sm text-gray-500">
                          Current stock: {product.stock} | Recommended: {Math.ceil(recommendedStock)}
                        </div>
                      </div>
                      <div className={`text-sm px-3 py-1 rounded-full ${
                        needsReorder 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {needsReorder ? 'Reorder Needed' : 'Stock OK'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Promotion Strategy */}
        {analytics?.product_performance && analytics.product_performance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>🎯 AI-Powered Promotion Strategy</CardTitle>
              <CardDescription>Optimize pricing and promotions to maximize profit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.product_performance.map((product, index) => {
                  const margin = product.profit_margin_
                  let recommendation = ""
                  let action = ""
                  
                  if (margin < 25) {
                    recommendation = "Consider price increase of 5-10% to improve margins"
                    action = "Price Increase"
                  } else if (margin > 40) {
                    recommendation = "Good margins - consider 10-15% discount to boost volume"
                    action = "Discount Opportunity"
                  } else {
                    recommendation = "Margins are optimal - maintain current pricing"
                    action = "Maintain Price"
                  }
                  
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{product.product}</h4>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          action === 'Price Increase' ? 'bg-blue-100 text-blue-800' :
                          action === 'Discount Opportunity' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {action}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{recommendation}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Current margin: {margin}% | Price: RM{product.price_unit} | Cost: RM{product.cost_unit}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Anomaly Detection */}
        <Card>
          <CardHeader>
            <CardTitle>🚨 Anomaly Detection (ML)</CardTitle>
            <CardDescription>AI detects unusual sales patterns using Isolation Forest</CardDescription>
          </CardHeader>
          <CardContent>
            {anomalies.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Found {anomalies.length} unusual sales pattern{anomalies.length > 1 ? 's' : ''}
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {anomalies.map((anomaly, index) => (
                            <li key={index}>
                              {anomaly.product}: {anomaly.quantity} units (RM{anomaly.revenue}) on {anomaly.date}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      ✅ No unusual sales patterns detected
                    </p>
                    <p className="text-sm text-green-700">
                      All sales transactions appear normal.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  RM {(analytics?.total_revenue || 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Total Revenue</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics?.total_products || 0}
                </div>
                <div className="text-gray-600">Active Products</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics?.total_sales || 0}
                </div>
                <div className="text-gray-600">Total Transactions</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}