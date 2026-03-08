"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import axios from "axios"

export default function CSVUpload() {
  const [businessProfile, setBusinessProfile] = useState<any | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/business")
        setBusinessProfile(res.data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchProfile()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError("Please select a CSV file")
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError("")
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to upload file")
    } finally {
      setUploading(false)
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
              Please complete your business registration first to access CSV upload.
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
          <h1 className="text-3xl font-bold text-gray-900">Upload CSV Data</h1>
          <p className="text-gray-600 mt-2">Import your sales data from a CSV file to populate your analytics.</p>
        </div>

        {/* CSV Format Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Expected CSV Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Your CSV file must contain the following columns:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
              <div className="grid grid-cols-4 gap-4 font-semibold text-gray-700 mb-2">
                <div>product</div>
                <div>quantity</div>
                <div>date</div>
                <div>revenue</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-gray-600">
                <div>Biryani</div>
                <div>5</div>
                <div>2024-01-15</div>
                <div>40.00</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-gray-600">
                <div>Ais Kosong</div>
                <div>3</div>
                <div>2024-01-16</div>
                <div>3.00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Your CSV File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-file"
              />
              <label htmlFor="csv-file" className="cursor-pointer">
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div className="text-sm text-gray-600">
                    {file ? (
                      <span className="text-green-600 font-medium">{file.name}</span>
                    ) : (
                      "Click to select a CSV file"
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Only CSV files are supported
                  </div>
                </div>
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload CSV File"}
            </Button>
          </CardContent>
        </Card>

        {/* Upload Result */}
        {uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Upload Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-green-700">{uploadResult.message}</p>
                {uploadResult.message && uploadResult.message.includes("Successfully uploaded") && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✅ Your sales data has been imported successfully! You can now view your analytics in the Analytics section.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}