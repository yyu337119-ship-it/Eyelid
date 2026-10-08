"use client"

import { Plus, Trash2 } from "lucide-react"
import type { ReferenceEntry } from "@/data/content"

const inputClass =
  "w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm leading-6 text-stone-800 outline-none focus:border-[#1f4b3a]"

const fields = [
  ["authors", "作者", "作者，留空待填"],
  ["title", "题目", "文献题目，留空待填"],
  ["source", "来源", "期刊、书或报告，留空待填"],
  ["year", "年份", "年份，留空待填"],
] as const

export function ReferenceEntryCard({
  entry,
  origin,
  onJump,
  onChange,
  onRemove,
}: {
  entry: ReferenceEntry
  origin?: string
  onJump?: () => void
  onChange: (patch: Partial<ReferenceEntry>) => void
  onRemove: () => void
}) {
  return (
    <article data-ref-id={entry.id} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
      {origin ? (
        onJump ? (
          <button type="button" onClick={onJump} className="mb-2 text-left text-xs leading-5 text-[#1f4b3a] underline underline-offset-2">
            {origin}
          </button>
        ) : (
          <p className="mb-2 text-xs leading-5 text-stone-500">{origin}</p>
        )
      ) : null}
      <div className="grid gap-2">
        {fields.map(([key, label, placeholder]) => (
          <label key={key} className="grid gap-1 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:items-center">
            <span className="text-xs font-medium text-stone-600">{label}</span>
            <input
              value={entry[key]}
              placeholder={placeholder}
              aria-label={label}
              onChange={(event) => onChange({ [key]: event.target.value })}
              className={inputClass}
            />
          </label>
        ))}
        <label className="grid gap-1 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:items-center">
          <span className="text-xs font-medium text-stone-600">链接</span>
          <input
            value={entry.link}
            placeholder="可选，例如 DOI 或原文网址"
            aria-label="链接（可选）"
            inputMode="url"
            onChange={(event) => onChange({ link: event.target.value })}
            className={inputClass}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="mt-2 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-red-700"
      >
        <Trash2 className="size-3.5" />
        删除此条
      </button>
    </article>
  )
}

export function AddEntryButton({
  children,
  onClick,
}: {
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md border border-dashed border-[#1f4b3a]/40 bg-white px-2.5 py-1.5 text-[13px] font-medium text-[#1f4b3a] hover:bg-[#eef5f1]"
    >
      <Plus className="size-3.5" />
      {children}
    </button>
  )
}
