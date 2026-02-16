'use client'

import { useEffect } from 'react'
import { Invoice } from '../lib/types'
import InvoiceForm from './InvoiceForm'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (invoice: Invoice) => void
  invoice?: Invoice
}

export default function InvoiceModal({ isOpen, onClose, onSubmit, invoice }: InvoiceModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (invoiceData: Invoice) => {
    onSubmit(invoiceData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-gray-50 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {invoice ? 'Edit Invoice' : 'Create New Invoice'}
              </h2>
              {invoice && (
                <p className="mt-1 text-sm text-gray-600">
                  Invoice Number: {invoice.invoiceNumber}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <InvoiceForm invoice={invoice} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}