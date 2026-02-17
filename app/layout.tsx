import type { Metadata } from 'next'
import { Inter, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import { InvoiceProvider } from '@/lib/InvoiceContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const bricolage = Bricolage_Grotesque({ 
  subsets: ['latin'],
  variable: '--font-bricolage',
})

export const metadata: Metadata = {
  title: 'Invoice Manager',
  description: 'Manage your sales invoices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${bricolage.variable} ${inter.className}`} suppressHydrationWarning>
        <InvoiceProvider>
          {children}
        </InvoiceProvider>
      </body>
    </html>
  )
}