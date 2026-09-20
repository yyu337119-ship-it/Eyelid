"use client"

import { useMemo, useState } from "react"
import { BookOpen, Filter, Menu } from "lucide-react"
import { AssayCard } from "@/components/assay-card"
import { SourceBadge } from "@/components/source-badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  abbreviations,
  categories,
  sources,
  type SourceId,
} from "@/data/content"
import { cn } from "@/lib/utils"

type FilterId = "all" | SourceId

function NavList({
  filter,
  onNavigate,
}: {
  filter: FilterId
  onNavigate?: () => void
}) {
  return (
    <nav className="space-y-5 text-sm">
      {categories.map((category) => (
        <div key={category.id}>
          <a
            href={`#${category.id}`}
            onClick={onNavigate}
            className="block font-semibold text-stone-900 hover:text-[#1f4b3a]"
          >
            {category.roman}、{category.title}
          </a>
          <ul className="mt-2 space-y-3 border-l border-stone-200 pl-3">
            {category.subsections.map((subsection) => (
              <li key={subsection.id}>
                <p className="text-xs font-medium text-stone-500">{subsection.title}</p>
                <ul className="mt-1 space-y-1">
                  {subsection.assays
                    .filter((assay) => filter === "all" || assay.source === filter)
                    .map((assay) => (
                      <li key={assay.id}>
                        <a
                          href={`#${assay.id}`}
                          onClick={onNavigate}
                          className={cn(
                            "block leading-5 hover:underline",
                            assay.source === "paper2" ? "text-[#c2301e]" : "text-[#9a6b00]"
                          )}
                        >
                          {assay.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <a href="#refs" onClick={onNavigate} className="block font-semibold text-stone-900">
        文献与颜色约定
      </a>
    </nav>
  )
}

export function PhenotypeApp() {
  const [filter, setFilter] = useState<FilterId>("all")
  const [menuOpen, setMenuOpen] = useState(false)

  const visible = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      subsections: category.subsections
        .map((subsection) => ({
          ...subsection,
          assays: subsection.assays.filter((assay) => filter === "all" || assay.source === filter),
        }))
        .filter((subsection) => subsection.assays.length > 0),
    }))
  }, [filter])

  return (
    <div className="min-h-screen bg-[#f6f1e7] text-stone-800">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f6f1e7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#1f4b3a] uppercase">
              小鼠眼部表型评价手册
            </p>
            <h1 className="truncate text-lg font-semibold text-stone-900 sm:text-xl">
              如何系统评价小鼠眼睑异常表型
            </h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="打开目录"
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
              <BookOpen className="size-3.5" />
              目录
            </p>
            <NavList filter={filter} />
          </div>
        </aside>

        <main className="space-y-10 pb-16">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm leading-7 text-stone-700">
              按解剖部位回答同一个问题：这只小鼠的眼表异常该如何系统评价。四大分类各自独立成章；每个小分支固定写出检测手段/仪器、分子标志物、观察结果和原文图表。红色条目来自
              <span className="mx-1 font-medium text-[#c2301e]">[2] Awat2−/− / ATR101 药理研究</span>
              ，黄色条目来自
              <span className="mx-1 font-medium text-[#9a6b00]">[5] KR/TG 过表达 TGFα 发育研究</span>
              。贴图已按笔记中的归纳文字重新写过图注，不再照抄原文长图例。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-[#c2301e] ring-1 ring-red-100">
                红字 = [2] Widjaja-Adhi 2026 IOVS
              </span>
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-[#9a6b00] ring-1 ring-amber-100">
                黄字 = [5] Dong 2015 Dev Biol
              </span>
            </div>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {abbreviations.map((item) => (
                <div key={item.abbr} className="rounded-lg bg-stone-50 px-3 py-2">
                  <dt className="font-mono text-xs font-semibold text-stone-500">{item.abbr}</dt>
                  <dd className="text-sm text-stone-700">{item.full}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="size-4 text-stone-500" />
            <span className="text-sm text-stone-500">按文献筛选</span>
            {(
              [
                ["all", "全部"],
                ["paper2", "[2] 红字"],
                ["paper5", "[5] 黄字"],
              ] as const
            ).map(([id, label]) => (
              <Button
                key={id}
                size="sm"
                variant={filter === id ? "default" : "outline"}
                onClick={() => setFilter(id)}
              >
                {label}
              </Button>
            ))}
          </div>

          {visible.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24 space-y-5">
              <div className="rounded-2xl bg-[#1f4b3a] px-5 py-4 text-white">
                <p className="text-xs tracking-[0.2em] uppercase opacity-80">{category.roman}</p>
                <h2 className="text-2xl font-semibold">{category.title}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50">{category.question}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/90">{category.summary}</p>
              </div>

              {category.subsections.map((subsection) => (
                <div key={subsection.id} id={subsection.id} className="space-y-3">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-stone-900">
                    <span className="h-4 w-1 rounded-full bg-[#1f4b3a]" />
                    {subsection.title}
                  </h3>
                  <div className="space-y-4">
                    {subsection.assays.map((assay) => (
                      <AssayCard key={assay.id} assay={assay} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}

          <section id="refs" className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-stone-900">文献与颜色约定</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              网页颜色与笔记 PDF 一致：红色对应药理文章 [2]，黄色对应发育文章 [5]。图表来源写在每张图的图注里。
            </p>
            <Separator className="my-4" />
            <div className="grid gap-4">
              {(["paper2", "paper5"] as const).map((id) => {
                const paper = sources[id]
                return (
                  <article key={id} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                    <div className="mb-2">
                      <SourceBadge source={id} />
                    </div>
                    <h3 className="text-sm font-semibold leading-6 text-stone-900">{paper.title}</h3>
                    <p className="mt-1 text-sm text-stone-600">{paper.authors}</p>
                    <p className="text-sm text-stone-600">
                      {paper.journal}, {paper.year}, {paper.volume}. DOI: {paper.doi}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">模型：{paper.model}</p>
                    <a
                      className="mt-2 inline-block text-sm text-[#1f4b3a] underline underline-offset-4"
                      href={paper.doiUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      打开 DOI
                    </a>
                  </article>
                )
              })}
            </div>
          </section>
        </main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[min(100%,22rem)] overflow-y-auto bg-[#f6f1e7]">
          <SheetHeader>
            <SheetTitle>目录</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <NavList filter={filter} onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
