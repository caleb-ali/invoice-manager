'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useInvoices } from '@/lib/InvoiceContext'
import ClientDate from '@/components/ClientDate'


export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getInvoiceById } = useInvoices()
  const invoice = getInvoiceById(id)

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-4">The invoice you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'text-green-600 bg-green-50 border-green-200',
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      overdue: 'text-red-600 bg-red-50 border-red-200',
    }
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const handlePrint = () => {
    window.print()
  }

  const downloadAttachment = (url: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none">
          {/* Invoice Header */}
          <div className="px-8 py-8 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Invoice Number: <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Date: <span className="font-medium text-gray-900"><ClientDate dateString={invoice.date} /></span>
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Due Date: <span className="font-medium text-gray-900"><ClientDate dateString={invoice.dueDate} /></span>
                </p>
              </div>
              <div className={`px-4 py-2 border rounded-lg ${getStatusColor(invoice.status)}`}>
                <p className="text-sm font-semibold uppercase">{invoice.status}</p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h2>
            <div>
              <p className="text-lg font-semibold text-gray-900">{invoice.clientName}</p>
              <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
              {invoice.clientAddress && (
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{invoice.clientAddress}</p>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="px-8 py-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700">Qty</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm text-gray-900">{item.description}</td>
                    <td className="py-4 text-sm text-gray-600 text-right">{item.quantity}</td>
                    <td className="py-4 text-sm text-gray-600 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-8 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {/* Attachments */}
          {invoice.attachments && invoice.attachments.length > 0 && (
            <div className="px-8 py-6 border-t border-gray-200 print:hidden">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Attachments</h3>
              <div className="space-y-2">
                {invoice.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {(attachment.fileSize / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadAttachment(attachment.url, attachment.fileName)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}