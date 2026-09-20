"use client"

import { useState } from "react"
import Image from "next/image"
import { Expand, ExternalLink, ImageOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { buttonVariants } from "@/components/ui/button"
import type { Figure, SourceId } from "@/data/content"
import { SourceBadge } from "@/components/source-badge"
import { cn } from "@/lib/utils"

export function FigureBlock({
  figure,
  source,
}: {
  figure: Figure
  source: SourceId
}) {
  const [open, setOpen] = useState(false)

  return (
    <figure className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      {figure.src ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full cursor-zoom-in bg-stone-50"
        >
          <Image
            src={figure.src}
            alt={figure.paperFig}
            width={1400}
            height={900}
            className="mx-auto h-auto max-h-[420px] w-auto object-contain"
          />
          <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
            <Expand className="size-3" />
            放大
          </span>
        </button>
      ) : (
        <div className="flex flex-col items-start gap-3 bg-stone-50 px-4 py-5">
          <div className="flex items-center gap-2 text-stone-500">
            <ImageOff className="size-4" />
            <span className="text-sm">笔记 PDF 未贴此原图</span>
          </div>
          {figure.pmcUrl ? (
            <a
              href={figure.pmcUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex")}
            >
              <ExternalLink className="size-3.5" />
              在 PMC 打开原文图
            </a>
          ) : null}
        </div>
      )}
      <figcaption className="space-y-1.5 border-t border-stone-100 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-stone-700">{figure.paperFig}</span>
          <SourceBadge source={source} />
        </div>
        <p className="text-sm leading-6 text-stone-600">{figure.caption}</p>
      </figcaption>
      {figure.src ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[92vh] max-w-5xl sm:max-w-5xl overflow-auto p-3 sm:p-4">
            <DialogHeader>
              <DialogTitle className="font-mono text-sm">{figure.paperFig}</DialogTitle>
            </DialogHeader>
            <Image
              src={figure.src}
              alt={figure.paperFig}
              width={1800}
              height={1200}
              className="h-auto w-full object-contain"
            />
            <p className="text-sm leading-6 text-stone-600">{figure.caption}</p>
          </DialogContent>
        </Dialog>
      ) : null}
    </figure>
  )
}
