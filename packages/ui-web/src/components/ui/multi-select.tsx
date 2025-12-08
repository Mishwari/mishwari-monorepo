import * as React from "react"
import { X, Check } from "lucide-react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { filterByArabicSearch } from "../../lib/searchUtils"

interface MultiSelectProps {
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "اختر...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredOptions = filterByArabicSearch(
    options.map(o => ({ city: o.label, ...o })),
    searchQuery
  )

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const removeOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue))
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-10 w-full flex-wrap gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer",
          isOpen && "ring-2 ring-brand-primary border-brand-primary",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {value.length === 0 ? (
          <span className="text-gray-500">{placeholder}</span>
        ) : (
          value.map(v => {
            const option = options.find(o => o.value === v)
            return option ? (
              <span key={v} className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary-light text-brand-primary rounded-full text-xs font-semibold">
                {option.label}
                {!disabled && (
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeOption(v)
                    }}
                  />
                )}
              </span>
            ) : null
          })
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن مدينة..."
                className="w-full pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">لا توجد نتائج</div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors",
                    value.includes(option.value) ? "bg-brand-primary-light" : "hover:bg-slate-50"
                  )}
                >
                  <span className={cn(
                    "text-sm font-bold",
                    value.includes(option.value) ? "text-brand-primary" : "text-brand-text-dark"
                  )}>
                    {option.label}
                  </span>
                  {value.includes(option.value) && (
                    <Check className="w-4 h-4 text-brand-primary" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
