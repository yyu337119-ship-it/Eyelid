"use client"

import { useRef } from "react"
import Image from "next/image"
import { Expand, ExternalLink, ImageOff, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { formatCites, type Figure, type SourceId } from "@/data/content"
import { cn } from "@/lib/utils"
import { EditableText } from "@/components/editable-text"

export function FigureBlock({
  figure,
  sources,
  onPaperFigChange,
  onCaptionChange,
}: {
  figure: Figure
  sources: SourceId[]
  onPaperFigChange?: (value: string) => void
  onCaptionChange?: (value: string) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  function openLightbox() {
    dialogRef.current?.showModal()
  }

  function closeLightbox() {
    dialogRef.current?.close()
  }

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      {figure.src ? (
        <button
          type="button"
          onClick={openLightbox}
          className="relative block w-full cursor-zoom-in bg-stone-50"
        >
          <Image
            src={figure.src}
            alt={figure.paperFig}
            width={1400}
            height={900}
            className="mx-auto h-auto max-h-[420px] w-auto object-contain"
          />
          <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
            <Expand className="size-3" />
            点击放大
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
      <div className="space-y-1.5 border-t border-stone-100 px-3 py-2.5">
        <p className="text-sm font-medium text-stone-800">
          {onPaperFigChange ? (
            <EditableText
              value={figure.paperFig}
              onChange={onPaperFigChange}
              className="font-medium"
            />
          ) : (
            figure.paperFig
          )}
          <span className="ml-2 font-normal text-stone-500">{formatCites(sources)}</span>
        </p>
        {onCaptionChange ? (
          <EditableText
            value={figure.caption}
            onChange={onCaptionChange}
            multiline
            className="text-sm leading-6 text-stone-600"
          />
        ) : (
          <p className="text-sm leading-6 text-stone-600">{figure.caption}</p>
        )}
      </div>

      {figure.src ? (
        <dialog
          ref={dialogRef}
          className="relative w-[min(100%,72rem)] max-h-[92vh] overflow-auto rounded-xl bg-white p-4 shadow-xl backdrop:bg-black/70"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox()
          }}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-md text-stone-600 hover:bg-stone-100"
            aria-label="关闭"
          >
            <X className="size-4" />
          </button>
          <p className="pr-10 text-sm font-medium text-stone-800">{figure.paperFig}</p>
          <Image
            src={figure.src}
            alt={figure.paperFig}
            width={1800}
            height={1200}
            className="mt-3 h-auto w-full object-contain"
          />
          <p className="mt-3 text-sm leading-6 text-stone-600">{figure.caption}</p>
        </dialog>
      ) : null}
    </div>
  )
}
