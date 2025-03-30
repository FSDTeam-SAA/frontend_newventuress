"use client"

import { useState, useEffect } from "react"

interface DateFormatterProps {
  date: Date
  format?: string
}

export function DateFormatter({ date, format = "dd MMM, yyyy" }: DateFormatterProps) {
  const [formattedDate, setFormattedDate] = useState<string>("")

  useEffect(() => {
    // Only format the date on the client side
    const formatDate = (date: Date) => {
      try {
        // Simple date formatting - you can use a library like date-fns for more complex formatting
        const day = date.getDate().toString().padStart(2, "0")
        const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date)
        const year = date.getFullYear()
        return `${day} ${month}, ${year}`
      } catch (error) {
        console.error("Error formatting date:", error)
        return ""
      }
    }

    setFormattedDate(formatDate(date))
  }, [date, format])

  // Return empty div during SSR to avoid hydration mismatch
  return <span>{formattedDate}</span>
}

