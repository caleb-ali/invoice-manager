import { render, screen, fireEvent } from '@testing-library/react'
import InvoiceList from '@/components/InvoiceList'
import { Invoice } from '@/lib/types'

// Mock invoice data used across all tests
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    clientName: 'Acme Corp',
    clientEmail: 'acme@example.com',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    items: [{ id: '1', description: 'Service', quantity: 1, price: 1000, total: 1000 }],
    subtotal: 1000,
    tax: 100,
    total: 1100,
    status: 'paid',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    clientName: 'TechStart',
    clientEmail: 'tech@example.com',
    date: '2024-02-20',
    dueDate: '2024-03-20',
    items: [{ id: '2', description: 'Design', quantity: 1, price: 2000, total: 2000 }],
    subtotal: 2000,
    tax: 200,
    total: 2200,
    status: 'pending',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
]

// Reusable mock handler functions
const mockOnDelete = jest.fn()
const mockOnEdit = jest.fn()
const mockOnView = jest.fn()

// Helper to render the component with default props
const renderInvoiceList = (invoices = mockInvoices) => {
  return render(
    <InvoiceList
      invoices={invoices}
      onDelete={mockOnDelete}
      onEdit={mockOnEdit}
      onView={mockOnView}
    />
  )
}

// Clear mocks between each test so calls don't bleed over
beforeEach(() => {
  jest.clearAllMocks()
})

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('InvoiceList rendering', () => {
  it('renders all invoice rows', () => {
    renderInvoiceList()

  })

  it('renders client names correctly', () => {
    renderInvoiceList()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('TechStart')).toBeInTheDocument()
  })

  it('renders client emails correctly', () => {
    renderInvoiceList()
    expect(screen.getByText('acme@example.com')).toBeInTheDocument()
    expect(screen.getByText('tech@example.com')).toBeInTheDocument()
  })

  it('renders status badges correctly', () => {
    renderInvoiceList()
    expect(screen.getByText('Paid')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    renderInvoiceList()
    expect(screen.getByText('Invoice')).toBeInTheDocument()
    expect(screen.getByText('Client')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('shows empty state when no invoices are passed', () => {
    renderInvoiceList([])
    expect(screen.getByText('No invoices found')).toBeInTheDocument()
  })

  it('shows create invoice prompt in empty state', () => {
    renderInvoiceList([])
    expect(screen.getByText('Get started by creating a new invoice.')).toBeInTheDocument()
  })
})

// ─── Interactions ─────────────────────────────────────────────────────────────

describe('InvoiceList interactions', () => {
  it('calls onView when a row is clicked', () => {
    renderInvoiceList()
    fireEvent.click(screen.getByText('INV-001'))
    expect(mockOnView).toHaveBeenCalledWith('1')
  })

  it('calls onEdit with the correct invoice when edit is clicked', () => {
    renderInvoiceList()
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])
    expect(mockOnEdit).toHaveBeenCalledWith(mockInvoices[0])
  })

  it('does not call onView when edit button is clicked', () => {
    renderInvoiceList()
    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])
    expect(mockOnView).not.toHaveBeenCalled()
  })

  it('calls onDelete with correct id after confirmation', () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true)
    renderInvoiceList()
    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('does not call onDelete when confirmation is cancelled', () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false)
    renderInvoiceList()
    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])
    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('does not call onView when delete button is clicked', () => {
    window.confirm = jest.fn(() => true)
    renderInvoiceList()
    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])
    expect(mockOnView).not.toHaveBeenCalled()
  })
})