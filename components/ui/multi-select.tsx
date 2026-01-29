"use client"

import * as React from "react"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onSelectedChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onSelectedChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onSelectedChange(selected.filter((item) => item !== option))
    } else {
      onSelectedChange([...selected, option])
    }
  }

  const handleRemove = (option: string) => {
    onSelectedChange(selected.filter((item) => item !== option))
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="w-full px-3 py-2 border border-border rounded-lg bg-background cursor-pointer hover:bg-background/80 transition-colors flex items-center justify-between min-h-10"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selected.length > 0 ? (
            selected.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm"
              >
                <span>{item}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(item)
                  }}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={cn("transition-transform text-muted-foreground", {
            "rotate-180": open,
          })}
        />
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="max-h-64 overflow-y-auto">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 cursor-pointer border-b border-border last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => handleToggle(option)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground flex-1">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
