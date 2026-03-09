"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import { CheckCircle, XCircle, AlertCircle, CreditCard, TrendingUp, Building2, DollarSign } from "lucide-react"
import { useBusiness } from "@/lib/business-context"

interface LoanScore {
  score: number
  max_loan_amount: number
  eligibility: string
  status: string
}

interface LoanProvider {
  name: string
  programs: Array<{
    name: string
    min_score: number
    max_amount: number
    interest_rate: number
    tenure_months: number
    description: string
  }>
}

export default function LoanCenter() {
  const [loanScore, setLoanScore] = useState<LoanScore | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<any>(null)
  const [showApplication, setShowApplication] = useState(false)
  const { activeBusiness, loading: bizLoading } = useBusiness()

  // Application form state
  const [applicationData, setApplicationData] = useState({
    applicant_name: "",
    applicant_ic: "",
    business_registration_number: "",
    loan_amount: "",
    loan_purpose: "",
    monthly_income: "",
    existing_debts: "",
    collateral_details: "",
    guarantor_name: "",
    guarantor_ic: "",
    contact_number: "",
    email: ""
  })

  useEffect(() => {
    if (bizLoading || !activeBusiness) return
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/loan-score")
        setLoanScore(res.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [activeBusiness, bizLoading])

  const fetchLoanScore = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/loan-score")
      setLoanScore(response.data)
    } catch (error) {
      console.error("Error fetching loan score:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyForLoan = (program: any, provider: any) => {
    setSelectedProgram({ ...program, provider: provider.name })
    setShowApplication(true)

    // Auto-fill application form
    setApplicationData({
      applicant_name: activeBusiness?.business_name || "",
      applicant_ic: "",
      business_registration_number: "",
      loan_amount: program.max_amount.toString(),
      loan_purpose: "Business expansion and working capital",
      monthly_income: activeBusiness?.monthly_revenue?.toString() || "",
      existing_debts: activeBusiness?.existing_loan_commitment?.toString() || "",
      collateral_details: "",
      guarantor_name: "",
      guarantor_ic: "",
      contact_number: "",
      email: ""
    })
  }

  const submitApplication = async () => {
    // In a real app, this would submit to a backend
    alert("Application submitted successfully! You will be contacted within 3-5 business days.")
    setShowApplication(false)
    setSelectedProgram(null)
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
              Please complete your business registration first to access loan assessment.
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

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return "text-green-600"
    if (score >= 0.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getEligibilityIcon = (eligibility: string) => {
    if (eligibility === "Eligible") return <CheckCircle className="h-6 w-6 text-green-600" />
    if (eligibility === "Under Review") return <AlertCircle className="h-6 w-6 text-yellow-600" />
    return <XCircle className="h-6 w-6 text-red-600" />
  }

  // Mock loan providers (in real app, this would come from backend)
  const loanProviders: LoanProvider[] = [
    {
      name: "Bank Rakyat Indonesia (BRI)",
      programs: [
        {
          name: "KUR Mikro",
          min_score: 0.3,
          max_amount: 50000,
          interest_rate: 6.0,
          tenure_months: 60,
          description: "For micro businesses with turnover up to RM300k/year"
        },
        {
          name: "KUR Kecil",
          min_score: 0.5,
          max_amount: 500000,
          interest_rate: 7.0,
          tenure_months: 60,
          description: "For small businesses with turnover RM300k-RM2.5M/year"
        }
      ]
    },
    {
      name: "BNI (Bank Negara Indonesia)",
      programs: [
        {
          name: "BNI KUR",
          min_score: 0.4,
          max_amount: 100000,
          interest_rate: 6.5,
          tenure_months: 48,
          description: "Special financing for MSMEs"
        }
      ]
    },
    {
      name: "Bank Mandiri",
      programs: [
        {
          name: "Mandiri KUR",
          min_score: 0.6,
          max_amount: 200000,
          interest_rate: 7.5,
          tenure_months: 60,
          description: "Comprehensive financing for growing businesses"
        }
      ]
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Pre-Eligibility & Matching Center</h1>
          <p className="text-gray-600 mt-2">Check your loan eligibility and explore financing options tailored to your business.</p>
        </div>

        {/* Loan Score Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Loan Eligibility Assessment
            </CardTitle>
            <CardDescription>
              Your loan score is calculated based on business performance, financial stability, and credit history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loanScore ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(loanScore.score)}`}>
                    {(loanScore.score * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Loan Score</div>
                  <Progress value={loanScore.score * 100} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    RM{loanScore.max_loan_amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Max Eligible Amount</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getEligibilityIcon(loanScore.eligibility)}
                    <div>
                      <div className="text-lg font-semibold">{loanScore.eligibility}</div>
                      <div className="text-sm text-gray-600">{loanScore.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button onClick={fetchLoanScore} disabled={loading}>
                  {loading ? "Calculating..." : "Calculate Loan Score"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        {loanScore && (
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Factors contributing to your loan score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">40%</div>
                  <div className="text-sm text-gray-600">Revenue Stability</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">30%</div>
                  <div className="text-sm text-gray-600">Profit Margin</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">20%</div>
                  <div className="text-sm text-gray-600">Cash Flow</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">10%</div>
                  <div className="text-sm text-gray-600">Debt Ratio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Provider Matching */}
        {loanScore && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Matching Loan Programs
              </CardTitle>
              <CardDescription>
                Based on your loan score, here are financing programs you may be eligible for:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanProviders.map((provider) => (
                  <div key={provider.name} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{provider.name}</h3>
                    <div className="space-y-3">
                      {provider.programs
                        .filter(program => loanScore.score >= program.min_score)
                        .map((program, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{program.name}</h4>
                              <p className="text-sm text-gray-600">{program.description}</p>
                            </div>
                            <Button
                              onClick={() => applyForLoan(program, provider)}
                              size="sm"
                            >
                              Apply for {program.name}
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Max Amount:</span>
                              <div className="font-medium">RM{program.max_amount.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Interest Rate:</span>
                              <div className="font-medium">{program.interest_rate}%</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Tenure:</span>
                              <div className="font-medium">{program.tenure_months} months</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {provider.programs.filter(program => loanScore.score >= program.min_score).length === 0 && (
                        <p className="text-gray-500 text-sm">No programs available for your current score</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Application Form */}
        {showApplication && selectedProgram && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Apply for {selectedProgram.name} - {selectedProgram.provider}
              </CardTitle>
              <CardDescription>
                Please fill in your application details. Some fields have been auto-filled based on your business profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="applicant_name">Applicant Name *</Label>
                    <Input
                      id="applicant_name"
                      value={applicationData.applicant_name}
                      onChange={(e) => setApplicationData({...applicationData, applicant_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicant_ic">IC Number *</Label>
                    <Input
                      id="applicant_ic"
                      placeholder="e.g., 123456-78-9012"
                      value={applicationData.applicant_ic}
                      onChange={(e) => setApplicationData({...applicationData, applicant_ic: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="business_registration">Business Registration Number</Label>
                    <Input
                      id="business_registration"
                      value={applicationData.business_registration_number}
                      onChange={(e) => setApplicationData({...applicationData, business_registration_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loan_amount">Requested Loan Amount (RM) *</Label>
                    <Input
                      id="loan_amount"
                      type="number"
                      value={applicationData.loan_amount}
                      onChange={(e) => setApplicationData({...applicationData, loan_amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loan_purpose">Loan Purpose *</Label>
                    <Select value={applicationData.loan_purpose} onValueChange={(value) => setApplicationData({...applicationData, loan_purpose: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Business expansion and working capital">Business expansion and working capital</SelectItem>
                        <SelectItem value="Purchase of equipment">Purchase of equipment</SelectItem>
                        <SelectItem value="Inventory financing">Inventory financing</SelectItem>
                        <SelectItem value="Property renovation">Property renovation</SelectItem>
                        <SelectItem value="Debt refinancing">Debt refinancing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="monthly_income">Monthly Business Income (RM) *</Label>
                    <Input
                      id="monthly_income"
                      type="number"
                      value={applicationData.monthly_income}
                      onChange={(e) => setApplicationData({...applicationData, monthly_income: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="existing_debts">Existing Monthly Debt Payments (RM)</Label>
                    <Input
                      id="existing_debts"
                      type="number"
                      value={applicationData.existing_debts}
                      onChange={(e) => setApplicationData({...applicationData, existing_debts: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="collateral">Collateral Details</Label>
                    <Input
                      id="collateral"
                      placeholder="e.g., Business property, equipment, etc."
                      value={applicationData.collateral_details}
                      onChange={(e) => setApplicationData({...applicationData, collateral_details: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guarantor_name">Guarantor Name</Label>
                    <Input
                      id="guarantor_name"
                      value={applicationData.guarantor_name}
                      onChange={(e) => setApplicationData({...applicationData, guarantor_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guarantor_ic">Guarantor IC Number</Label>
                    <Input
                      id="guarantor_ic"
                      value={applicationData.guarantor_ic}
                      onChange={(e) => setApplicationData({...applicationData, guarantor_ic: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      placeholder="e.g., +60123456789"
                      value={applicationData.contact_number}
                      onChange={(e) => setApplicationData({...applicationData, contact_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={submitApplication} className="flex-1">
                  Submit Application
                </Button>
                <Button variant="outline" onClick={() => setShowApplication(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}