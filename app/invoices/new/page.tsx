'use client'

import { useRouter } from 'next/navigation'
import { useInvoices } from '@/lib/InvoiceContext'
import InvoiceForm from '@/components/InvoiceForm'
import { Invoice } from '@/lib/types'

export default function NewInvoicePage() {
  const router = useRouter()
  const { addInvoice } = useInvoices()

  const handleSubmit = (invoice: Invoice) => {
    addInvoice(invoice)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create a new invoice
          </p>
        </div>

        <InvoiceForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}