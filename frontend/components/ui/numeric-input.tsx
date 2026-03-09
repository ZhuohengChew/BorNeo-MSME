"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface NumericInputProps {
  id?: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  allowDecimal?: boolean
  placeholder?: string
  required?: boolean
  className?: string
}

function formatWithCommas(num: number): string {
  if (num === 0) return ""
  const parts = num.toString().split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return parts.join(".")
}

export function NumericInput({
  id,
  value,
  onChange,
  prefix,
  suffix,
  allowDecimal = true,
  placeholder = "0",
  required,
  className,
}: NumericInputProps) {
  const [display, setDisplay] = React.useState(() => formatWithCommas(value))

  // Sync display when value changes externally (e.g. form reset, demo load)
  React.useEffect(() => {
    setDisplay(formatWithCommas(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value

    // Strip everything except digits, commas, and optionally a decimal point
    const pattern = allowDecimal ? /[^0-9.,]/g : /[^0-9,]/g
    let cleaned = raw.replace(pattern, "")

    // Allow only one decimal point
    if (allowDecimal) {
      const parts = cleaned.split(".")
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("")
      }
    }

    // Remove existing commas to get the numeric string
    const numericStr = cleaned.replace(/,/g, "")

    // Re-format with commas (only the integer part)
    let formatted = ""
    if (numericStr !== "") {
      const numParts = numericStr.split(".")
      numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      formatted = numParts.join(".")
    }

    setDisplay(formatted)
    onChange(numericStr === "" ? 0 : parseFloat(numericStr) || 0)
  }

  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-sm text-muted-foreground select-none pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          prefix ? "pl-11" : "px-3",
          suffix ? "pr-9" : "pr-3",
          className
        )}
      />
      {suffix && (
        <span className="absolute right-3 text-sm text-muted-foreground select-none pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  )
}
