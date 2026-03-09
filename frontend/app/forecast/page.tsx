"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import axios from "axios"
import { TrendingUp, Calendar } from "lucide-react"

interface ForecastData {
  forecast: Array<{
    yhat: number
    yhat_lower?: number
    yhat_upper?: number
  }>
  days: number
}

export default function Forecast() {
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [businessProfile, setBusinessProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forecastRes, businessRes] = await Promise.all([
          axios.get("http://localhost:8000/api/forecast"),
          axios.get("http://localhost:8000/api/business")
        ])
        setForecast(forecastRes.data)
        setBusinessProfile(businessRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setForecast(null)
      }
    }
    fetchData()
  }, [])

  const fetchForecast = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:8000/api/forecast")
      setForecast(response.data)
    } catch (error) {
      console.error("Error fetching forecast:", error)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  const isProfileComplete = businessProfile && businessProfile.business_name

  if (!isProfileComplete) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Business Registration Required</h2>
            <p className="text-yellow-700 mb-4">
              Please complete your business registration first to access demand forecasting.
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

  // Mock forecast data for demo
  const mockForecastData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    forecast: 45000 + Math.random() * 10000,
    lower: 42000 + Math.random() * 8000,
    upper: 48000 + Math.random() * 12000,
  }))

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demand Forecast</h1>
            <p className="text-gray-600 mt-2">30-day revenue forecast using ARIMA time series analysis.</p>
          </div>
          <Button onClick={fetchForecast} disabled={loading}>
            {loading ? "Loading..." : "Refresh Forecast"}
          </Button>
        </div>

        {/* Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              30-Day Revenue Forecast
            </CardTitle>
            <CardDescription>
              Statistical forecasting with confidence intervals using ARIMA model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={mockForecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                labelFormatter={(label) => `Day ${label}`}
  contentStyle={{ 
    backgroundColor: '#ffffff', 
    border: '1px solid #cbd5e1', // A slate-300 border
    borderRadius: '8px',
    padding: '10px'
  }}
  itemStyle={{ 
    color: '#000000', // Forces "Upper Bound", "Forecast", etc. to be Black
    fontWeight: 'bold',
    fontSize: '14px'
  }}
  formatter={(value, name) => [
    `RM ${Number(value).toLocaleString()}`,
    name === 'forecast' ? 'Forecast' : name === 'upper' ? 'Upper Bound' : 'Lower Bound'
  ]}
/>
                <Area
                  type="monotone"
                  dataKey="upper"
                  stackId="1"
                  stroke="none"
                  fill="#93c5fd"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stackId="2"
                  stroke="none"
                  fill="#ffffff"
                  fillOpacity={1}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                  dot={{ fill: "#1d4ed8", strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Forecast Insights */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  RM 45,230
                </div>
                <div className="text-slate-800">Average Daily Forecast</div>
                <div className="text-sm text-green-600 mt-1">+8.5% from current</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  RM 1,356,900
                </div>
                <div className="text-slate-800">30-Day Total Forecast</div>
                <div className="text-sm text-blue-600 mt-1">80% confidence interval</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  +12.3%
                </div>
                <div className="text-slate-800">Growth Trend</div>
                <div className="text-sm text-slate-500 mt-1">Next 30 days</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forecast Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Forecast Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900">ARIMA Model</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    AutoRegressive Integrated Moving Average model for time series forecasting.
                    Requires minimum 7 days of historical sales data.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Confidence Intervals</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    80% confidence bands show the range where actual values are likely to fall.
                    Wider bands indicate higher uncertainty.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Key Insights</h3>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Expected 12.3% revenue growth over the next 30 days</li>
                  <li>• Peak demand expected around day 18-22</li>
                  <li>• Consider increasing inventory for high-demand periods</li>
                  <li>• Monitor actual vs forecast performance weekly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}