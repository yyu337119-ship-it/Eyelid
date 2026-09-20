"use client"

import { useState } from "react"
import { BookOpen, Menu } from "lucide-react"
import { AssayCard } from "@/components/assay-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  abbreviations,
  categories,
  sectionSources,
  sources,
  topicSources,
} from "@/data/content"
import { SourceCite } from "@/components/source-badge"

function NavList({ onNavigate }: { onNavigate?: () => void }) {
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
            {category.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={onNavigate}
                  className="font-medium text-stone-800 hover:underline"
                >
                  {section.index}、{section.title}
                </a>
                <ul className="mt-1 space-y-1">
                  {section.topics.map((topic) => (
                    <li key={topic.id}>
                      <a
                        href={`#${topic.id}`}
                        onClick={onNavigate}
                        className="block leading-5 text-stone-600 hover:text-stone-900 hover:underline"
                      >
                        {`${topic.mark}${topic.title}`}
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
        参考文献
      </a>
    </nav>
  )
}

export function PhenotypeApp() {
  const [menuOpen, setMenuOpen] = useState(false)

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

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
              <BookOpen className="size-3.5" />
              目录
            </p>
            <NavList />
          </div>
        </aside>

        <main className="space-y-10 pb-16">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm leading-7 text-stone-700">
              按解剖部位系统评价小鼠眼表异常。一级为四大分类；其下再分「1、2、」二级和「①②」三级。每一级分支标题后直接标注文献
              【1】或【2】，不再用红字、黄字区分来源。每张卡片仍固定写出检测手段/仪器、分子标志物、观察结果和原文图表。
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {abbreviations.map((item) => (
                <div key={item.abbr} className="rounded-lg bg-stone-50 px-3 py-2">
                  <dt className="font-mono text-xs font-semibold text-stone-500">{item.abbr}</dt>
                  <dd className="text-sm text-stone-700">{item.full}</dd>
                </div>
              ))}
            </dl>
          </section>

          {categories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24 space-y-6">
              <div className="rounded-2xl bg-[#1f4b3a] px-5 py-4 text-white">
                <p className="text-xs tracking-[0.2em] uppercase opacity-80">{category.roman}</p>
                <h2 className="text-2xl font-semibold">
                  {category.roman}、{category.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50">{category.question}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/90">{category.summary}</p>
              </div>

              {category.sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24 space-y-5">
                  <h3 className="flex flex-wrap items-baseline gap-x-2 border-b border-stone-300 pb-2 text-xl font-semibold text-stone-900">
                    <span>
                      {section.index}、{section.title}
                    </span>
                    <SourceCite ids={sectionSources(section)} className="font-normal" />
                  </h3>
                  {section.topics.map((topic) => (
                    <div key={topic.id} id={topic.id} className="scroll-mt-24 space-y-3">
                      <h4 className="flex flex-wrap items-baseline gap-x-2 text-base font-semibold text-stone-800">
                        <span className="text-[#1f4b3a]">{`${topic.mark}${topic.title}`}</span>
                        <SourceCite ids={topicSources(topic)} className="font-normal" />
                      </h4>
                      <div className="space-y-4">
                        {topic.assays.map((assay) => (
                          <AssayCard key={assay.id} assay={assay} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          ))}

          <section id="refs" className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-stone-900">参考文献</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              分支后的【1】【2】对应下列两篇。原笔记 PDF 中分别为文献 [2] 与 [5]。
            </p>
            <Separator className="my-4" />
            <div className="grid gap-4">
              {(["paper1", "paper2"] as const).map((id) => {
                const paper = sources[id]
                return (
                  <article key={id} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-900">{paper.cite}</p>
                    <h3 className="mt-1 text-sm leading-6 text-stone-800">{paper.title}</h3>
                    <p className="mt-1 text-sm text-stone-600">{paper.authors}</p>
                    <p className="text-sm text-stone-600">
                      {paper.journal}, {paper.year}, {paper.volume}. DOI: {paper.doi}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">{paper.noteMap}</p>
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
            <NavList onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
