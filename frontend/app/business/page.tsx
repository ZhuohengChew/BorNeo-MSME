"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { useBusiness } from "@/lib/business-context"
import { Building2, Check, Trash2 } from "lucide-react"

export default function BusinessRegistration() {
  const { businesses, activeBusiness, switchBusiness, refresh } = useBusiness()
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    years_operating: 0,
    monthly_revenue: 0,
    profit_margin: 0,
    existing_loan_commitment: 0
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post("/api/business", formData)
      setMessage("Business profile created successfully!")
      setFormData({
        business_name: "",
        business_type: "",
        years_operating: 0,
        monthly_revenue: 0,
        profit_margin: 0,
        existing_loan_commitment: 0
      })
      await refresh()
    } catch (error) {
      setMessage("Error saving business profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const loadDemo = async () => {
    setLoading(true)
    try {
      const resp = await axios.post("/api/demo")
      const profile = resp.data.business_profile
      setFormData({
        business_name: profile.business_name,
        business_type: profile.business_type,
        years_operating: profile.years_operating,
        monthly_revenue: profile.monthly_revenue,
        profit_margin: profile.profit_margin,
        existing_loan_commitment: profile.existing_loan_commitment,
      })
      setMessage("Demo profile loaded from server!")
      await refresh()
    } catch (err) {
      setMessage("Failed to load demo data")
    } finally {
      setLoading(false)
    }
  }

  const deleteBusiness = async (id: string) => {
    try {
      await axios.delete(`/api/businesses/${id}`)
      await refresh()
      setMessage("Business deleted.")
    } catch {
      setMessage("Failed to delete business")
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Registration</h1>
          <p className="text-gray-600 mt-2">Register a new business or manage your existing businesses.</p>
        </div>

        {/* Existing Businesses */}
        {businesses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Businesses</CardTitle>
              <CardDescription>
                You have {businesses.length} registered business{businesses.length > 1 ? "es" : ""}. Select one to set it as active.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {businesses.map((b) => (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                      b.id === activeBusiness?.id
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <button
                      onClick={() => switchBusiness(b.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        b.id === activeBusiness?.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}>
                        {b.id === activeBusiness?.id ? <Check className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{b.business_name}</p>
                        <p className="text-xs text-gray-500">{b.business_type} &middot; RM {b.monthly_revenue.toLocaleString()}/mo</p>
                      </div>
                    </button>
                    <button
                      onClick={() => deleteBusiness(b.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
                      title="Delete business"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo button */}
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={loadDemo}
            disabled={loading}
          >
            Load Demo Data
          </Button>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Please provide accurate information about your business for better analytics and loan eligibility assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    placeholder="Enter business name"
                    value={formData.business_name}
                    onChange={(e) => handleChange("business_name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <Select onValueChange={(value) => handleChange("business_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="fnb">Food & Beverage</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_operating">Years Operating</Label>
                  <Input
                    id="years_operating"
                    type="number"
                    placeholder="0"
                    value={formData.years_operating}
                    onChange={(e) => handleChange("years_operating", parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_revenue">Monthly Revenue (RM)</Label>
                  <Input
                    id="monthly_revenue"
                    type="number"
                    placeholder="0"
                    value={formData.monthly_revenue}
                    onChange={(e) => handleChange("monthly_revenue", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profit_margin">Profit Margin (%)</Label>
                  <Input
                    id="profit_margin"
                    type="number"
                    placeholder="0"
                    value={formData.profit_margin}
                    onChange={(e) => handleChange("profit_margin", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existing_loan_commitment">Existing Loan Commitment (RM)</Label>
                  <Input
                    id="existing_loan_commitment"
                    type="number"
                    placeholder="0"
                    value={formData.existing_loan_commitment}
                    onChange={(e) => handleChange("existing_loan_commitment", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {message}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Saving..." : "Save Business Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}