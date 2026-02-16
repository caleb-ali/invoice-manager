import { Invoice } from './types'

const STORAGE_KEY = 'invoices'

export function getInvoices(): Invoice[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

export function getInvoiceById(id: string): Invoice | null {
  const invoices = getInvoices()
  return invoices.find(inv => inv.id === id) || null
}

export function createInvoice(invoice: Invoice): void {
  const invoices = getInvoices()
  invoices.push(invoice)
  saveInvoices(invoices)
}

export function updateInvoice(id: string, updatedInvoice: Invoice): void {
  const invoices = getInvoices()
  const index = invoices.findIndex(inv => inv.id === id)
  
  if (index !== -1) {
    invoices[index] = updatedInvoice
    saveInvoices(invoices)
  }
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices()
  const filtered = invoices.filter(inv => inv.id !== id)
  saveInvoices(filtered)
}

export function initializeMockData(mockInvoices: Invoice[]): void {
  const existing = getInvoices()
  if (existing.length === 0) {
    saveInvoices(mockInvoices)
  }
}