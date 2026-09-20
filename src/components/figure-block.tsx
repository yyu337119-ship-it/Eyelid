"use client"

import { useRef } from "react"
import Image from "next/image"
import { Expand, ExternalLink, ImageOff, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { type Figure } from "@/data/content"
import { publicPath } from "@/lib/public-path"
import { cn } from "@/lib/utils"

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

export function FigureBlock({ figure }: { figure: Figure }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const displaySrc = publicPath(figure.src)

  function openLightbox() {
    dialogRef.current?.showModal()
  }

  function closeLightbox() {
    dialogRef.current?.close()
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

      <div className="space-y-1.5 border-t border-stone-100 px-3 py-2.5">
        <p className="text-sm font-medium text-stone-800">{figure.paperFig}</p>
        <p className="text-sm leading-6 text-stone-600">{figure.caption}</p>
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
              className="mt-3 h-auto max-h-[70vh] w-full object-contain"
            />
            <p className="mt-3 text-sm leading-6 text-stone-600">{figure.caption}</p>
          </div>
        </dialog>
      ) : null}
    </div>
  )
}
