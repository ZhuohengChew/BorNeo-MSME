"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { TrendingUp, Calendar } from "lucide-react"

interface ForecastItem {
  day: number
  yhat: number
  yhat_lower: number
  yhat_upper: number
  date: string
  holiday?: string
  holiday_impact?: number
  seasonal_boost?: number
}

interface ForecastData {
  forecast: ForecastItem[]
  holidays: Array<{
    date: string
    name: string
    sales_increase: string
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

  // Use real forecast data or show loading
  const chartData = forecast?.forecast?.map((item) => {
    const dateObj = new Date(item.date)
    const dateLabel = dateObj.toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })
    return {
      day: item.day,
      dateLabel,
      date: item.date,
      forecast: Math.round(item.yhat),
      lower: Math.round(item.yhat_lower),
      upper: Math.round(item.yhat_upper),
      holiday: item.holiday,
    }
  }) || []

  const avgForecast = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, item) => sum + item.forecast, 0) / chartData.length)
    : 0

  const totalForecast = chartData.length > 0
    ? Math.round(chartData.reduce((sum, item) => sum + item.forecast, 0))
    : 0

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demand Forecast</h1>
            <p className="text-gray-600 mt-2">30-day revenue forecast with Malaysian holiday & seasonal adjustments.</p>
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
              Statistical forecasting with confidence intervals, holiday & seasonal adjustments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="dateLabel" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => value.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value, name) => {
                    if (typeof value !== 'number') return value
                    return [
                      `RM ${value.toLocaleString('en-MY', { maximumFractionDigits: 0 })}`,
                      name === 'forecast' ? 'Forecast Sales' : name === 'upper' ? 'Upper Bound' : 'Lower Bound'
                    ]
                  }}
                  labelFormatter={(label) => `📅 ${label}`}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Area
                  type="monotone"
                  dataKey="upper"
                  stackId="1"
                  stroke="none"
                  fill="#fbbf24"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stackId="2"
                  stroke="none"
                  fill="#fbbf24"
                  fillOpacity={0.1}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
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
                <div className="text-3xl font-bold text-purple-600">
                  RM {avgForecast.toLocaleString('en-MY')}
                </div>
                <div className="text-gray-600">Average Daily Forecast</div>
                <div className="text-sm text-green-600 mt-1">Based on real sales data</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">
                  RM {totalForecast.toLocaleString('en-MY')}
                </div>
                <div className="text-gray-600">30-Day Total Forecast</div>
                <div className="text-sm text-blue-600 mt-1">Includes holiday boosts</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {forecast?.holidays?.length || 0}
                </div>
                <div className="text-gray-600">Upcoming Holidays</div>
                <div className="text-sm text-gray-500 mt-1">Next 30 days</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holidays & Sales Impact Table */}
        {forecast?.holidays && forecast.holidays.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Malaysian Holidays - Expected Sales Impact
              </CardTitle>
              <CardDescription>
                Holiday dates in the forecast period and their expected sales increase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Holiday Name</TableHead>
                      <TableHead>Expected Sales Increase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecast.holidays.map((holiday, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {new Date(holiday.date).toLocaleDateString('en-MY', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </TableCell>
                        <TableCell>{holiday.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            +{holiday.sales_increase}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

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
                    AutoRegressive Integrated Moving Average for time series forecasting based on your actual sales history.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Holiday & Seasonal Adjustments</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Forecast is adjusted for Malaysian holidays (CNY, Eid, Deepavali, Christmas, etc.) and monthly seasonal patterns.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Confidence Intervals</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Orange/amber bands show prediction ranges. Wider bands indicate higher uncertainty.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Weekend Boost</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Fridays and Saturdays get a 10% sales boost for typical retail patterns in Malaysia.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900">💡 Key Insights</h3>
                <ul className="text-sm text-purple-800 mt-2 space-y-1">
                  <li>• Major holidays like Awal Muharram & Prophet's Birthday offer 40%+ sales potential boosts</li>
                  <li>• December is your peak season with 30% seasonal boost + year-end holidays</li>
                  <li>• Plan extra inventory for holiday periods to maximize revenue</li>
                  <li>• Monitor actual vs forecast weekly to refine future predictions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}