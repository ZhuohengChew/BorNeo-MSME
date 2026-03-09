"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useBusiness } from "@/lib/business-context"

export default function Simulation() {
  const [analytics, setAnalytics] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [discountPct, setDiscountPct] = useState([0])
  const [boostPct, setBoostPct] = useState([0])
  const { activeBusiness, loading: bizLoading } = useBusiness()

  const loadDemo = async () => {
    setLoading(true)
    try {
      await axios.post("/api/demo")
      const resp = await axios.get("/api/analytics")
      setAnalytics(resp.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isProfileComplete = !!activeBusiness

  if (bizLoading) {
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
              Please complete your business registration first to access simulation tools.
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

  const currentRevenue = analytics ? analytics.total_revenue : 0
  const profitMargin = activeBusiness?.profit_margin || 30
  const currentProfit = currentRevenue * (profitMargin / 100)

  // Calculate simulation
  const discountFactor = 1 + (discountPct[0] / 100)
  const boostFactor = 1 + (boostPct[0] / 100)

  const simulatedRevenue = currentRevenue * discountFactor * boostFactor
  const simulatedProfit = simulatedRevenue * (profitMargin / 100)

  const revenueChange = simulatedRevenue - currentRevenue
  const profitChange = simulatedProfit - currentProfit

  const comparisonData = [
    {
      scenario: 'Current',
      revenue: currentRevenue,
      profit: currentProfit
    },
    {
      scenario: 'Simulated',
      revenue: simulatedRevenue,
      profit: simulatedProfit
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">🧮 What-If Simulation</h1>
          <p className="mt-2 text-gray-600">
            Run discount or marketing scenario simulations to understand impact on revenue and profit.
          </p>
        </div>

        <div className="flex justify-center">
          <Button variant="secondary" onClick={loadDemo} disabled={loading}>
            🎬 Load Demo Data
          </Button>
        </div>

        {analytics && (
          <>
            {/* Current Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Current Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      RM{currentRevenue.toLocaleString()}
                    </div>
                    <div className="text-gray-600">Current Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      RM{currentProfit.toLocaleString()}
                    </div>
                    <div className="text-gray-600">Current Profit</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Simulation Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount on Products (%)
                      </label>
                      <input
                        type="range"
                        min="-20"
                        max="50"
                        step="1"
                        value={discountPct[0]}
                        onChange={(e) => setDiscountPct([parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>-20%</span>
                        <span className="font-semibold">{discountPct[0]}%</span>
                        <span>+50%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Negative = discount (reduce price), Positive = price increase
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marketing Boost (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={boostPct[0]}
                        onChange={(e) => setBoostPct([parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>0%</span>
                        <span className="font-semibold">{boostPct[0]}%</span>
                        <span>+100%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Expected sales increase from marketing efforts
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation Results */}
            <Card>
              <CardHeader>
                <CardTitle>📈 Simulation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      RM{simulatedRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Projected Revenue</div>
                    <div className={`text-sm font-medium ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {revenueChange >= 0 ? '+' : ''}RM{revenueChange.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      RM{simulatedProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Projected Profit</div>
                    <div className={`text-sm font-medium ${profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitChange >= 0 ? '+' : ''}RM{profitChange.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {((simulatedRevenue - currentRevenue) / currentRevenue * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Revenue Change %</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${simulatedProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {simulatedProfit > 0 ? '✅ Profitable' : '⚠️ Loss'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>

                {/* Comparison Chart */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Before vs After Simulation</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scenario" />
                      <YAxis tickFormatter={(value) => `RM${value.toLocaleString()}`} />
                      <Tooltip formatter={(value) => [`RM${Number(value).toLocaleString()}`, '']} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      <Bar dataKey="profit" fill="#10b981" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!analytics && (
          <div className="text-center py-8">
            <p className="text-gray-500">Load demo data to begin simulation.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}