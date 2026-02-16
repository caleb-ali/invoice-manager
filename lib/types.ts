export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientAddress?: string
  date: string // ISO date string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: PaymentStatus
  notes?: string
  attachments?: InvoiceAttachment[]
  createdAt: string
  updatedAt: string
}

export interface InvoiceAttachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  uploadedAt: string
}

export interface InvoiceFormData {
  clientName: string
  clientEmail: string
  clientAddress?: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  tax: number
  status: PaymentStatus
  notes?: string
}

export interface InvoiceFilters {
  status?: PaymentStatus
  startDate?: string
  endDate?: string
  searchQuery?: string
}