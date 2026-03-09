"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { useBusiness } from "@/lib/business-context"

export default function BusinessProfilePage() {
  const { activeBusiness, loading: bizLoading, refresh } = useBusiness()
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
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (activeBusiness) {
      setFormData({
        business_name: activeBusiness.business_name,
        business_type: activeBusiness.business_type,
        years_operating: activeBusiness.years_operating,
        monthly_revenue: activeBusiness.monthly_revenue,
        profit_margin: activeBusiness.profit_margin,
        existing_loan_commitment: activeBusiness.existing_loan_commitment,
      })
    }
  }, [activeBusiness])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = activeBusiness ? { ...formData, id: activeBusiness.id } : formData
      await axios.post("/api/business", payload)
      setMessage("Business profile updated successfully!")
      setIsEditing(false)
      await refresh()
    } catch (error) {
      setMessage("Error updating business profile")
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

  const isProfileComplete = formData.business_name && formData.business_type

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
          <p className="text-gray-600 mt-2">
            {isProfileComplete
              ? "View and edit your business information."
              : "Complete your business registration to unlock all features."
            }
          </p>
        </div>

        {/* Status */}
        {isProfileComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Profile Complete
                </p>
                <p className="text-sm text-green-700">
                  Your business profile is set up and ready to use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update your business details below."
                    : "Review your current business information."
                  }
                </CardDescription>
              </div>
              {isProfileComplete && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing || !isProfileComplete ? (
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
                    <Select onValueChange={(value) => handleChange("business_type", value)} value={formData.business_type}>
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
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Business Name</Label>
                    <p className="text-sm text-gray-900 mt-1">{formData.business_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Business Type</Label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">{formData.business_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Years Operating</Label>
                    <p className="text-sm text-gray-900 mt-1">{formData.years_operating} years</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Monthly Revenue</Label>
                    <p className="text-sm text-gray-900 mt-1">RM {formData.monthly_revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Profit Margin</Label>
                    <p className="text-sm text-gray-900 mt-1">{formData.profit_margin}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Existing Loan Commitment</Label>
                    <p className="text-sm text-gray-900 mt-1">RM {formData.existing_loan_commitment.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}