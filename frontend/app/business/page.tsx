"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

export default function BusinessRegistration() {
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
      const response = await axios.post("/api/business", formData)
      setMessage("Business profile saved successfully!")
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
      setFormData(profile)
      setMessage("Demo profile loaded from server!")
    } catch (err) {
      setMessage("Failed to load demo data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Registration</h1>
          <p className="text-gray-600 mt-2">Set up your business profile to get started with analytics and loan assessment.</p>
        </div>

        {/* Demo button */}
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={loadDemo}
            disabled={loading}
          >
            🎬 Load Demo Data
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