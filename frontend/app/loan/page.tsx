"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import { CheckCircle, XCircle, AlertCircle, CreditCard, Building2 } from "lucide-react"
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
    url: string
  }>
}

export default function LoanCenter() {
  const [loanScore, setLoanScore] = useState<LoanScore | null>(null)
  const [loading, setLoading] = useState(false)
  const { activeBusiness, loading: bizLoading } = useBusiness()

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

  const applyForLoan = (program: any) => {
    window.open(program.url, "_blank", "noopener,noreferrer")
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

  // Malaysian loan providers
  const loanProviders: LoanProvider[] = [
    {
      name: "CIMB Bank",
      programs: [
        {
          name: "Micro-Financing",
          min_score: 0.3,
          max_amount: 50000,
          interest_rate: 5.0,
          tenure_months: 60,
          description: "Micro-financing for small businesses with simplified documentation",
          url: "https://www.cimb.com.my/en/business/products/financing/micro-financing.html"
        },
        {
          name: "BizLite",
          min_score: 0.5,
          max_amount: 300000,
          interest_rate: 6.5,
          tenure_months: 84,
          description: "Collateral-free financing for SMEs with annual turnover up to RM3M",
          url: "https://www.cimb.com.my/en/business/products/financing/bizlite.html"
        }
      ]
    },
    {
      name: "Maybank",
      programs: [
        {
          name: "SME Clean Loan",
          min_score: 0.4,
          max_amount: 250000,
          interest_rate: 6.0,
          tenure_months: 60,
          description: "Unsecured financing for SMEs to fund working capital and business growth",
          url: "https://www.maybank2u.com.my/maybank2u/malaysia/en/business/financing/working_capital/sme_clean_loan.page"
        }
      ]
    },
    {
      name: "Public Bank",
      programs: [
        {
          name: "SWIFT Financing",
          min_score: 0.5,
          max_amount: 500000,
          interest_rate: 5.5,
          tenure_months: 60,
          description: "Fast-track financing for established SMEs with strong business track record",
          url: "https://www.pbebank.com/Business-Banking/Financing/SME-Financing.aspx"
        }
      ]
    },
    {
      name: "TEKUN Nasional",
      programs: [
        {
          name: "Skim Pembiayaan TEKUN",
          min_score: 0.3,
          max_amount: 100000,
          interest_rate: 4.0,
          tenure_months: 60,
          description: "Government-backed micro-financing for Bumiputera micro and small entrepreneurs",
          url: "https://www.tekun.gov.my/en/loan-financing/"
        }
      ]
    },
    {
      name: "Bank Rakyat",
      programs: [
        {
          name: "Pembiayaan Mikro-i",
          min_score: 0.3,
          max_amount: 50000,
          interest_rate: 4.0,
          tenure_months: 60,
          description: "Islamic micro-financing for small traders, hawkers and micro entrepreneurs",
          url: "https://www.bankrakyat.com.my/d/business/financing/micro-financing-i"
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
                              onClick={() => applyForLoan(program)}
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

      </div>
    </DashboardLayout>
  )
}