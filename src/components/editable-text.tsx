"use client"

import { Plus, Trash2 } from "lucide-react"
import { useHandbook } from "@/lib/handbook-store"
import { cn } from "@/lib/utils"

const fieldClass =
  "rounded-md border border-dashed border-emerald-800/35 bg-white text-inherit shadow-none outline-none focus:border-emerald-800"

export function EditableText({
  value,
  onChange,
  className,
  multiline = false,
  compact = false,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
  multiline?: boolean
  compact?: boolean
  placeholder?: string
}) {
  const { editMode } = useHandbook()
  if (!editMode) {
    return <span className={className}>{value}</span>
  }
  const sizing = compact ? "min-w-0 px-1 py-0.5 text-[13px] leading-5" : "w-full px-2 py-1"
  if (!multiline) {
    return (
      <input
        value={value}
        placeholder={placeholder}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldClass, sizing, className)}
      />
    )
  }
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={Math.min(8, Math.max(3, value.split("\n").length + 1))}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => onChange(event.target.value)}
      className={cn(fieldClass, sizing, "resize-y leading-6", className)}
    />
  )
}

export function EditableList({
  items,
  onChange,
  addLabel = "添加一条",
}: {
  items: string[]
  onChange: (items: string[]) => void
  addLabel?: string
}) {
  const { editMode } = useHandbook()
  if (!editMode) {
    if (!items.length) return null
    return (
      <ul className="list-disc space-y-1 pl-4 text-sm leading-6 text-stone-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <textarea
            value={item}
            rows={2}
            onChange={(event) => {
              const next = [...items]
              next[index] = event.target.value
              onChange(next)
            }}
            className={cn(fieldClass, "w-full resize-y px-2 py-1 text-sm leading-6")}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, current) => current !== index))}
            className="mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            aria-label="删除此条"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1 text-sm text-[#1f4b3a] hover:underline"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </button>
    </div>
  )
}
