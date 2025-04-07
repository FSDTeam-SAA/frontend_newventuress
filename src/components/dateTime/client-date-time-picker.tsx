"use client"

import { useState, useEffect } from "react"
import { DateTimePicker, type DateTimePickerProps } from "@/components/ui/datetime-picker"
import { ClientOnly } from "./client-only-wrapper"

export function ClientDateTimePicker(props: DateTimePickerProps) {
  const [value, setValue] = useState<Date | undefined>(undefined)

  // Initialize the date on the client side only
  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <ClientOnly fallback={<div className="h-10 w-full border rounded-md px-3 py-2">Loading...</div>}>
      <DateTimePicker
        {...props}
        value={value}
        onChange={(date) => {
          setValue(date)
          props.onChange?.(date)
        }}
      />
    </ClientOnly>
  )
}

