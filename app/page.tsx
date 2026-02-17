"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInvoices } from "@/lib/InvoiceContext";
import { filterInvoices, sortInvoices } from "@/lib/utils";
import { PaymentStatus, Invoice } from "@/lib/types";
import InvoiceList from "@/components/InvoiceList";
import InvoiceFilter from "@/components/InvoiceFilter";
import InvoiceModal from "@/components/InvoiceModal";

export default function Home() {
  const router = useRouter();
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(
    undefined
  );

  const filteredAndSortedInvoices = useMemo(() => {
    const filtered = filterInvoices(invoices, {
      status: statusFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      searchQuery: searchQuery || undefined,
    });
    return sortInvoices(filtered, "date", "desc");
  }, [invoices, statusFilter, startDate, endDate, searchQuery]);

  const stats = useMemo(() => {
    const paid = invoices.filter((inv) => inv.status === "paid");
    const pending = invoices.filter((inv) => inv.status === "pending");
    const overdue = invoices.filter((inv) => inv.status === "overdue");

    return {
      total: invoices.reduce((sum, inv) => sum + inv.total, 0),
      paid: paid.reduce((sum, inv) => sum + inv.total, 0),
      pending: pending.reduce((sum, inv) => sum + inv.total, 0),
      overdue: overdue.reduce((sum, inv) => sum + inv.total, 0),
      count: invoices.length,
    };
  }, [invoices]);

  const handleOpenModal = () => {
    setEditingInvoice(undefined);
    setIsModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInvoice(undefined);
  };

  const handleSubmitInvoice = (invoice: Invoice) => {
    if (editingInvoice) {
      updateInvoice(invoice.id, invoice);
    } else {
      addInvoice(invoice);
    }
  };

  const handleViewInvoice = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-[#282465] bg-clip-text text-transparent font-[family-name:var(--font-bricolage)]">
  Invoice Manager
</h1>
              <p className="mt-1 text-sm text-gray-400">
                Manage and track your sales invoices
              </p>
            </div>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-400 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Invoices
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.count}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Paid
                    </dt>
                    <dd className="text-lg font-semibold text-green-600">
                      ${stats.paid.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending
                    </dt>
                    <dd className="text-lg font-semibold text-yellow-600">
                      ${stats.pending.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Overdue
                    </dt>
                    <dd className="text-lg font-semibold text-red-600">
                      ${stats.overdue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Invoice List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white shadow rounded-lg">
          <InvoiceFilter
            statusFilter={statusFilter}
            startDate={startDate}
            endDate={endDate}
            searchQuery={searchQuery}
            onStatusChange={setStatusFilter}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSearchChange={setSearchQuery}
          />
          <InvoiceList
            invoices={filteredAndSortedInvoices}
            onDelete={deleteInvoice}
            onEdit={handleEditInvoice}
            onView={handleViewInvoice}
          />
        </div>
      </div>

      {/* Modal */}
      <InvoiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitInvoice}
        invoice={editingInvoice}
      />
    </main>
  );
}
