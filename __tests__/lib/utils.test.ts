import {
    formatCurrency,
    formatDate,
    calculateItemTotal,
    calculateSubtotal,
    calculateTotal,
    isOverdue,
    filterInvoices,
    sortInvoices,
  } from '@/lib/utils'
  import { Invoice } from '@/lib/types'
  
  // ─── formatCurrency ───────────────────────────────────────────────────────────
  
  describe('formatCurrency', () => {
    it('formats a whole number correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })
  
    it('formats a decimal number correctly', () => {
      expect(formatCurrency(50.5)).toBe('$50.50')
    })
  
    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })
  
    it('formats large numbers with commas', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })
  })
  
  // ─── formatDate ──────────────────────────────────────────────────────────────
  
  describe('formatDate', () => {
    it('formats a date string into readable format', () => {
      const result = formatDate('2024-01-15')
      // Check it contains the right parts without worrying about exact format
      expect(result).toContain('2024')
      expect(result).toContain('15')
    })
  
    it('returns a non-empty string for a valid date', () => {
      const result = formatDate('2024-06-01')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })
  
  // ─── calculateItemTotal ───────────────────────────────────────────────────────
  
  describe('calculateItemTotal', () => {
    it('multiplies quantity by price correctly', () => {
      const item = { id: '1', description: 'Test', quantity: 3, price: 50, total: 0 }
      expect(calculateItemTotal(item)).toBe(150)
    })
  
    it('returns 0 when quantity is 0', () => {
      const item = { id: '1', description: 'Test', quantity: 0, price: 50, total: 0 }
      expect(calculateItemTotal(item)).toBe(0)
    })
  
    it('handles decimal prices correctly', () => {
      const item = { id: '1', description: 'Test', quantity: 2, price: 10.5, total: 0 }
      expect(calculateItemTotal(item)).toBe(21)
    })
  })
  
  // ─── calculateSubtotal ────────────────────────────────────────────────────────
  
  describe('calculateSubtotal', () => {
    it('sums all item totals correctly', () => {
      const items = [
        { id: '1', description: 'A', quantity: 1, price: 100, total: 100 },
        { id: '2', description: 'B', quantity: 2, price: 50, total: 100 },
      ]
      expect(calculateSubtotal(items)).toBe(200)
    })
  
    it('returns 0 for an empty items array', () => {
      expect(calculateSubtotal([])).toBe(0)
    })
  
    it('handles a single item correctly', () => {
      const items = [{ id: '1', description: 'A', quantity: 1, price: 500, total: 500 }]
      expect(calculateSubtotal(items)).toBe(500)
    })
  })
  
  // ─── calculateTotal ───────────────────────────────────────────────────────────
  
  describe('calculateTotal', () => {
    it('adds subtotal and tax correctly', () => {
      expect(calculateTotal(500, 50)).toBe(550)
    })
  
    it('returns subtotal when tax is 0', () => {
      expect(calculateTotal(500, 0)).toBe(500)
    })
  
    it('handles decimal values correctly', () => {
      expect(calculateTotal(100.5, 10.25)).toBe(110.75)
    })
  })
  
  // ─── isOverdue ────────────────────────────────────────────────────────────────
  
  describe('isOverdue', () => {
    it('returns false for a paid invoice regardless of due date', () => {
      expect(isOverdue('2020-01-01', 'paid')).toBe(false)
    })
  
    it('returns true for a pending invoice past its due date', () => {
      expect(isOverdue('2020-01-01', 'pending')).toBe(true)
    })
  
    it('returns false for a pending invoice with a future due date', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      const futureDateString = futureDate.toISOString().split('T')[0]
      expect(isOverdue(futureDateString, 'pending')).toBe(false)
    })
  })
  
  // ─── filterInvoices ───────────────────────────────────────────────────────────
  
  // Shared mock data used across all filter tests
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      clientName: 'Acme Corp',
      clientEmail: 'acme@example.com',
      date: '2024-01-10',
      dueDate: '2024-02-10',
      items: [],
      subtotal: 1000,
      tax: 100,
      total: 1100,
      status: 'paid',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      clientName: 'TechStart',
      clientEmail: 'tech@example.com',
      date: '2024-02-15',
      dueDate: '2024-03-15',
      items: [],
      subtotal: 2000,
      tax: 200,
      total: 2200,
      status: 'pending',
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z',
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      clientName: 'Global Ltd',
      clientEmail: 'global@example.com',
      date: '2024-03-20',
      dueDate: '2024-04-20',
      items: [],
      subtotal: 3000,
      tax: 300,
      total: 3300,
      status: 'overdue',
      createdAt: '2024-03-20T00:00:00Z',
      updatedAt: '2024-03-20T00:00:00Z',
    },
  ]
  
  describe('filterInvoices', () => {
    it('returns all invoices when no filters are applied', () => {
      expect(filterInvoices(mockInvoices, {})).toHaveLength(3)
    })
  
    it('filters by paid status correctly', () => {
      const result = filterInvoices(mockInvoices, { status: 'paid' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })
  
    it('filters by pending status correctly', () => {
      const result = filterInvoices(mockInvoices, { status: 'pending' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })
  
    it('filters by overdue status correctly', () => {
      const result = filterInvoices(mockInvoices, { status: 'overdue' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('3')
    })
  
    it('filters by start date correctly', () => {
      const result = filterInvoices(mockInvoices, { startDate: '2024-02-01' })
      expect(result).toHaveLength(2)
      expect(result.map(i => i.id)).toEqual(['2', '3'])
    })
  
    it('filters by end date correctly', () => {
      const result = filterInvoices(mockInvoices, { endDate: '2024-02-01' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })
  
    it('filters by date range correctly', () => {
      const result = filterInvoices(mockInvoices, {
        startDate: '2024-02-01',
        endDate: '2024-03-01',
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })
  
    it('filters by client name search query', () => {
      const result = filterInvoices(mockInvoices, { searchQuery: 'acme' })
      expect(result).toHaveLength(1)
      expect(result[0].clientName).toBe('Acme Corp')
    })
  
    it('filters by invoice number search query', () => {
      const result = filterInvoices(mockInvoices, { searchQuery: 'INV-002' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })
  
    it('search is case insensitive', () => {
      const result = filterInvoices(mockInvoices, { searchQuery: 'ACME' })
      expect(result).toHaveLength(1)
    })
  
    it('returns empty array when no invoices match', () => {
      const result = filterInvoices(mockInvoices, { searchQuery: 'xyz123' })
      expect(result).toHaveLength(0)
    })
  
    it('combines status and date filters correctly', () => {
      const result = filterInvoices(mockInvoices, {
        status: 'pending',
        startDate: '2024-02-01',
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })
  })
  
  // ─── sortInvoices ─────────────────────────────────────────────────────────────
  
  describe('sortInvoices', () => {
    it('sorts by date descending by default', () => {
      const result = sortInvoices(mockInvoices, 'date', 'desc')
      expect(result[0].id).toBe('3')
      expect(result[2].id).toBe('1')
    })
  
    it('sorts by date ascending', () => {
      const result = sortInvoices(mockInvoices, 'date', 'asc')
      expect(result[0].id).toBe('1')
      expect(result[2].id).toBe('3')
    })
  
    it('sorts by total descending', () => {
      const result = sortInvoices(mockInvoices, 'total', 'desc')
      expect(result[0].total).toBe(3300)
      expect(result[2].total).toBe(1100)
    })
  
    it('sorts by total ascending', () => {
      const result = sortInvoices(mockInvoices, 'total', 'asc')
      expect(result[0].total).toBe(1100)
      expect(result[2].total).toBe(3300)
    })
  
    it('sorts by client name alphabetically', () => {
      const result = sortInvoices(mockInvoices, 'client', 'asc')
      expect(result[0].clientName).toBe('Acme Corp')
      expect(result[1].clientName).toBe('Global Ltd')
      expect(result[2].clientName).toBe('TechStart')
    })
  
    it('does not mutate the original array', () => {
      const original = [...mockInvoices]
      sortInvoices(mockInvoices, 'date', 'desc')
      expect(mockInvoices).toEqual(original)
    })
  })