"use client"

import { useRef } from "react"
import Image from "next/image"
import { Expand, ExternalLink, ImageOff, ImagePlus, RotateCcw, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { formatCites, type Figure, type SourceId } from "@/data/content"
import { cn } from "@/lib/utils"
import { EditableText } from "@/components/editable-text"
import { useHandbook } from "@/lib/handbook-store"

function FigureImage({
  src,
  alt,
  className,
  width,
  height,
}: {
  src: string
  alt: string
  className?: string
  width: number
  height: number
}) {
  if (src.startsWith("blob:") || src.startsWith("data:")) {
    return <img src={src} alt={alt} className={className} />
  }
  return <Image src={src} alt={alt} width={width} height={height} className={className} />
}

export function FigureBlock({
  figure,
  sources,
  onPaperFigChange,
  onCaptionChange,
  onRemove,
}: {
  figure: Figure
  sources: SourceId[]
  onPaperFigChange?: (value: string) => void
  onCaptionChange?: (value: string) => void
  onRemove?: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { figureUrls, replaceFigure, restoreFigure } = useHandbook()
  const figureId = figure.id
  const replaced = Boolean(figureId && figureUrls[figureId])
  const displaySrc = (figureId && figureUrls[figureId]) || figure.src

  function openLightbox() {
    dialogRef.current?.showModal()
  }

  function closeLightbox() {
    dialogRef.current?.close()
  }

  async function onFile(file?: File) {
    if (!file || !figureId) return
    try {
      await replaceFigure(figureId, file)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "替换图片失败")
    }
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white">
      {displaySrc ? (
        <button
          type="button"
          onClick={openLightbox}
          className="relative block w-full cursor-zoom-in overflow-hidden rounded-t-lg bg-stone-50"
        >
          <FigureImage
            src={displaySrc}
            alt={figure.paperFig}
            width={1400}
            height={900}
            className="mx-auto h-[min(420px,56vw)] w-auto max-w-full object-contain"
          />
          <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
            <Expand className="size-3" />
            点击放大
          </span>
          {replaced ? (
            <span className="absolute top-2 left-2 rounded-md bg-[#1f4b3a] px-2 py-0.5 text-[11px] text-white">
              已替换
            </span>
          ) : null}
        </button>
      ) : (
        <div className="flex flex-col items-start gap-3 bg-stone-50 px-4 py-5">
          <div className="flex items-center gap-2 text-stone-500">
            <ImageOff className="size-4" />
            <span className="text-sm">尚未贴图</span>
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

      <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 bg-[#f6f1e7] px-3 py-2.5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1f4b3a] px-3 py-1.5 text-sm text-white hover:bg-[#17382c]"
        >
          <ImagePlus className="size-3.5" />
          {displaySrc ? "替换图片" : "上传图片"}
        </button>
        {replaced ? (
          <button
            type="button"
            onClick={() => figureId && void restoreFigure(figureId)}
            className="inline-flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
          >
            <RotateCcw className="size-3.5" />
            恢复原图
          </button>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-stone-500 hover:text-stone-900"
          >
            删除此图
          </button>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            void onFile(file)
            event.target.value = ""
          }}
        />
      </div>

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

      {displaySrc ? (
        <dialog
          ref={dialogRef}
          className="w-[min(96vw,72rem)] max-h-[90vh] overflow-auto rounded-xl bg-white p-4 shadow-xl backdrop:bg-black/70"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox()
          }}
        >
          <div className="relative">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-0 right-0 inline-flex size-8 items-center justify-center rounded-md text-stone-600 hover:bg-stone-100"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
            <p className="pr-10 text-sm font-medium text-stone-800">{figure.paperFig}</p>
            <FigureImage
              src={displaySrc}
              alt={figure.paperFig}
              width={1800}
              height={1200}
              className="mt-3 h-auto w-full object-contain"
            />
            <p className="mt-3 text-sm leading-6 text-stone-600">{figure.caption}</p>
          </div>
        </dialog>
      ) : null}
    </div>
  )
}
