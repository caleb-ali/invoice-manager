'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Invoice } from './types'
import { getInvoices, saveInvoices, initializeMockData } from './storage'
import { mockInvoices } from './mockData'

interface InvoiceContextType {
  invoices: Invoice[]
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, invoice: Invoice) => void
  deleteInvoice: (id: string) => void
  getInvoiceById: (id: string) => Invoice | undefined
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize with mock data if empty
    initializeMockData(mockInvoices)
    const loaded = getInvoices()
    setInvoices(loaded)
    setIsInitialized(true)
  }, [])

  const addInvoice = (invoice: Invoice) => {
    const updated = [...invoices, invoice]
    setInvoices(updated)
    saveInvoices(updated)
  }

  const updateInvoice = (id: string, invoice: Invoice) => {
    const updated = invoices.map(inv => inv.id === id ? invoice : inv)
    setInvoices(updated)
    saveInvoices(updated)
  }

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter(inv => inv.id !== id)
    setInvoices(updated)
    saveInvoices(updated)
  }

  const getInvoiceById = (id: string) => {
    return invoices.find(inv => inv.id === id)
  }

  if (!isInitialized) {
    return null // or a loading spinner
  }

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      getInvoiceById,
    }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider')
  }
  return context
}