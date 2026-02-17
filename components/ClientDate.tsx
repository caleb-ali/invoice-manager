'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '../lib/utils'

interface ClientDateProps {
  dateString: string
}

export default function ClientDate({ dateString }: ClientDateProps) {
  const [formatted, setFormatted] = useState('')

  useEffect(() => {
    setFormatted(formatDate(dateString))
  }, [dateString])

  // Render a plain string on the server, formatted date on client
  return <span suppressHydrationWarning>{formatted || dateString}</span>
}