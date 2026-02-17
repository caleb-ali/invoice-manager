# Invoice Manager

A web application for managing sales invoices built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Create Invoices** - Add new invoices via a modal without leaving the dashboard
- **Edit Invoices** - Update existing invoice details and items
- **Delete Invoices** - Remove invoices with confirmation prompt
- **Invoice Detail View** - View complete invoice details on a dedicated page with print support
- **File Attachments** - Upload and manage files for each invoice with drag and drop support
- **Filtering** - Filter invoices by status (paid, pending, overdue), date range, and search by client name or invoice number
- **Dashboard Stats** - At a glance totals for paid, pending, and overdue amounts
- **Persistent Storage** - Invoice data is saved to local storage and persists across sessions

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Jest](https://jestjs.io/) - Unit testing
- [React Testing Library](https://testing-library.com/) - Component testing

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/invoice-manager.git
```

2. Navigate into the project directory:
```bash
cd invoice-manager
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

Run the full test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure
```
├── app/
│   ├── components/        # Reusable UI components
│   │   ├── ClientDate.tsx
│   │   ├── FileUpload.tsx
│   │   ├── InvoiceFilter.tsx
│   │   ├── InvoiceForm.tsx
│   │   ├── InvoiceList.tsx
│   │   └── InvoiceModal.tsx
│   ├── invoices/
│   │   └── [id]/          # Invoice detail page
│   ├── lib/               # Types, utilities, and state management
│   │   ├── InvoiceContext.tsx
│   │   ├── mockData.ts
│   │   ├── storage.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── layout.tsx
│   └── page.tsx           # Main dashboard
├── __tests__/
│   ├── components/        # Component tests
│   └── lib/               # Utility function tests
├── jest.config.js
├── jest.setup.ts
└── README.md
```
