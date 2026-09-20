"use client"

import Image from "next/image"
import { Expand, ExternalLink, ImageOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { buttonVariants } from "@/components/ui/button"
import { formatCites, type Figure, type SourceId } from "@/data/content"
import { cn } from "@/lib/utils"

export function FigureBlock({
  figure,
  sources,
}: {
  figure: Figure
  sources: SourceId[]
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      {figure.src ? (
        <Dialog>
          <DialogTrigger
            className="group relative block w-full cursor-zoom-in bg-stone-50"
            nativeButton={false}
            render={<button type="button" />}
          >
            <Image
              src={figure.src}
              alt={figure.paperFig}
              width={1400}
              height={900}
              className="mx-auto h-auto max-h-[420px] w-auto object-contain"
            />
            <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white sm:opacity-90">
              <Expand className="size-3" />
              点击放大
            </span>
          </DialogTrigger>
          <DialogContent className="max-h-[92vh] w-[min(96vw,72rem)] max-w-none overflow-auto p-3 sm:max-w-none sm:p-4">
            <DialogHeader>
              <DialogTitle className="text-sm">{figure.paperFig}</DialogTitle>
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
          {figure.paperFig}
          <span className="ml-2 font-normal text-stone-500">{formatCites(sources)}</span>
        </p>
        <p className="text-sm leading-6 text-stone-600">{figure.caption}</p>
      </div>
    </div>
  )
}
