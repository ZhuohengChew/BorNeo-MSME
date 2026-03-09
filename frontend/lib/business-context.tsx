"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import axios from "axios"

export interface BusinessProfile {
  id: string
  business_name: string
  business_type: string
  years_operating: number
  monthly_revenue: number
  profit_margin: number
  existing_loan_commitment: number
}

interface BusinessContextType {
  /** The currently active business profile (or null if none) */
  activeBusiness: BusinessProfile | null
  /** All registered businesses */
  businesses: BusinessProfile[]
  /** true while the initial fetch is in flight */
  loading: boolean
  /** Switch the active business */
  switchBusiness: (id: string) => Promise<void>
  /** Re-fetch the business list from the backend */
  refresh: () => Promise<void>
}

const BusinessContext = createContext<BusinessContextType>({
  activeBusiness: null,
  businesses: [],
  loading: true,
  switchBusiness: async () => {},
  refresh: async () => {},
})

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBusinesses = useCallback(async () => {
    try {
      const res = await axios.get("/api/businesses")
      const list: BusinessProfile[] = res.data.businesses || []
      setBusinesses(list)
      setActiveId(res.data.active_id || null)
    } catch (e) {
      console.error("Failed to fetch businesses", e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  const switchBusiness = useCallback(async (id: string) => {
    try {
      await axios.put(`/api/businesses/${id}/activate`)
      setActiveId(id)
    } catch (e) {
      console.error("Failed to switch business", e)
    }
  }, [])

  const activeBusiness = businesses.find(b => b.id === activeId) || null

  return (
    <BusinessContext.Provider
      value={{
        activeBusiness,
        businesses,
        loading,
        switchBusiness,
        refresh: fetchBusinesses,
      }}
    >
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusiness() {
  return useContext(BusinessContext)
}
