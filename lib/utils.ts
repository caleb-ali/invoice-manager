import { Invoice, InvoiceItem, PaymentStatus } from './types'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function calculateItemTotal(item: InvoiceItem): number {
  return item.quantity * item.price
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0)
}

export function calculateTotal(subtotal: number, tax: number): number {
  return subtotal + tax
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `INV-${timestamp}-${random}`
}

export function isOverdue(dueDate: string, status: PaymentStatus): boolean {
  if (status === 'paid') return false
  return new Date(dueDate) < new Date()
}

export function filterInvoices(
  invoices: Invoice[],
  filters: {
    status?: PaymentStatus
    startDate?: string
    endDate?: string
    searchQuery?: string
  }
): Invoice[] {
  return invoices.filter((invoice) => {
    // Filter by status
    if (filters.status && invoice.status !== filters.status) {
      return false
    }

    // Filter by date range
    if (filters.startDate && invoice.date < filters.startDate) {
      return false
    }
    if (filters.endDate && invoice.date > filters.endDate) {
      return false
    }

    // Filter by search query (client name or invoice number)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const matchesClient = invoice.clientName.toLowerCase().includes(query)
      const matchesNumber = invoice.invoiceNumber.toLowerCase().includes(query)
      if (!matchesClient && !matchesNumber) {
        return false
      }
    }

    return true
  })
}

export function sortInvoices(
  invoices: Invoice[],
  sortBy: 'date' | 'total' | 'client' = 'date',
  order: 'asc' | 'desc' = 'desc'
): Invoice[] {
  const sorted = [...invoices].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'total':
        comparison = a.total - b.total
        break
      case 'client':
        comparison = a.clientName.localeCompare(b.clientName)
        break
    }

    return order === 'asc' ? comparison : -comparison
  })

  return sorted
}