import { render, screen, fireEvent } from '@testing-library/react'
import InvoiceFilter from '@/components/InvoiceFilter'

// Default props with empty values and jest mock handlers
const defaultProps = {
  statusFilter: '' as const,
  startDate: '',
  endDate: '',
  searchQuery: '',
  onStatusChange: jest.fn(),
  onStartDateChange: jest.fn(),
  onEndDateChange: jest.fn(),
  onSearchChange: jest.fn(),
}

const renderFilter = (props = {}) => {
  return render(<InvoiceFilter {...defaultProps} {...props} />)
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('InvoiceFilter rendering', () => {
  it('renders the search input', () => {
    renderFilter()
    expect(screen.getByPlaceholderText(/search by client name or invoice number/i)).toBeInTheDocument()
  })

  it('renders the status dropdown', () => {
    renderFilter()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('renders the from date input', () => {
    renderFilter()
    expect(screen.getByLabelText('From Date')).toBeInTheDocument()
  })

  it('renders the to date input', () => {
    renderFilter()
    expect(screen.getByLabelText('To Date')).toBeInTheDocument()
  })

  it('does not show reset button when no filters are active', () => {
    renderFilter()
    expect(screen.queryByText('Reset')).not.toBeInTheDocument()
  })

  it('shows reset button when a status filter is active', () => {
    renderFilter({ statusFilter: 'paid' })
    expect(screen.getByText('Reset')).toBeInTheDocument()
  })

  it('shows reset button when a search query is active', () => {
    renderFilter({ searchQuery: 'acme' })
    expect(screen.getByText('Reset')).toBeInTheDocument()
  })
})

// ─── Interactions ─────────────────────────────────────────────────────────────

describe('InvoiceFilter interactions', () => {
  it('calls onSearchChange when typing in the search input', () => {
    renderFilter()
    const searchInput = screen.getByPlaceholderText(/search by client name or invoice number/i)
    fireEvent.change(searchInput, { target: { value: 'Acme' } })
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('Acme')
  })

  it('calls onStatusChange when a status is selected', () => {
    renderFilter()
    const statusSelect = screen.getByLabelText('Status')
    fireEvent.change(statusSelect, { target: { value: 'paid' } })
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('paid')
  })

  it('calls onStartDateChange when start date is changed', () => {
    renderFilter()
    const startDateInput = screen.getByLabelText('From Date')
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } })
    expect(defaultProps.onStartDateChange).toHaveBeenCalledWith('2024-01-01')
  })

  it('calls onEndDateChange when end date is changed', () => {
    renderFilter()
    const endDateInput = screen.getByLabelText('To Date')
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } })
    expect(defaultProps.onEndDateChange).toHaveBeenCalledWith('2024-12-31')
  })

  it('calls all reset handlers when reset button is clicked', () => {
    renderFilter({ statusFilter: 'paid' })
    fireEvent.click(screen.getByText('Reset'))
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('')
    expect(defaultProps.onStartDateChange).toHaveBeenCalledWith('')
    expect(defaultProps.onEndDateChange).toHaveBeenCalledWith('')
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('')
  })
})