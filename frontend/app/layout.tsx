import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BusinessProvider } from '@/lib/business-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BorNeo - MSME Business Intelligence',
  description: 'Comprehensive business intelligence and loan pre-eligibility system for MSMEs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BusinessProvider>{children}</BusinessProvider>
      </body>
    </html>
  )
}