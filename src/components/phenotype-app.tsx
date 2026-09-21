"use client"

import { useState } from "react"
import { BookOpen, Menu } from "lucide-react"
import { AssayCard } from "@/components/assay-card"
import { EditToolbar } from "@/components/edit-toolbar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  abbreviations,
  assayMark,
  sameSources,
  sectionSources,
  sources,
  topicSources,
} from "@/data/content"
import { SourceCite } from "@/components/source-badge"
import { EditableText } from "@/components/editable-text"
import { TocNav } from "@/components/toc-nav"
import { HandbookProvider, PUBLIC_SITE_URL, useHandbook } from "@/lib/handbook-store"

function PhenotypeAppInner() {
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    categories,
    intro,
    setIntro,
    dirty,
    refsLabel,
    setRefsLabel,
    updateCategory,
    updateSection,
    updateTopic,
    updateAssay,
  } = useHandbook()

  return (
    <div className="min-h-screen bg-[#f6f1e7] text-stone-800">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f6f1e7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start justify-between gap-3">
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
          <EditToolbar />
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-3 text-xs leading-5 text-stone-600 sm:px-6">
          目录四级：一、 / 1、 / ① / （1）。点「编辑正文」后，正文和左侧目录的编号、标题都可以改，再点绿色「保存到公开页」。第一次会要求粘贴
          GitHub 令牌；保存后约 1 分钟，别人刷新{" "}
          <a className="underline underline-offset-2" href={PUBLIC_SITE_URL} target="_blank" rel="noreferrer">
            {PUBLIC_SITE_URL}
          </a>{" "}
          就能看到。
          {dirty ? " 当前有未保存到公开页的修改。" : ""}
        </p>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
              <BookOpen className="size-3.5" />
              目录
            </p>
            <TocNav />
          </div>
        </aside>

        <main className="space-y-10 pb-16">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <EditableText
              value={intro}
              onChange={setIntro}
              multiline
              className="text-sm leading-7 text-stone-700"
            />
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
            <section key={category.id} id={category.id} className="scroll-mt-40 space-y-6">
              <div className="rounded-2xl bg-[#1f4b3a] px-5 py-4 text-white">
                <p className="text-xs tracking-[0.2em] uppercase opacity-80">{category.roman}</p>
                <h2 className="flex flex-wrap items-baseline gap-1 text-2xl font-semibold">
                  <EditableText
                    value={category.roman}
                    onChange={(roman) => updateCategory(category.id, { roman })}
                    className="w-12 text-2xl font-semibold"
                  />
                  <span>、</span>
                  <EditableText
                    value={category.title}
                    onChange={(title) => updateCategory(category.id, { title })}
                    className="text-2xl font-semibold"
                  />
                </h2>
                <div className="mt-2 text-sm leading-6 text-emerald-50">
                  <EditableText
                    value={category.question}
                    onChange={(question) => updateCategory(category.id, { question })}
                    multiline
                  />
                </div>
                <div className="mt-2 text-sm leading-6 text-emerald-100/90">
                  <EditableText
                    value={category.summary}
                    onChange={(summary) => updateCategory(category.id, { summary })}
                    multiline
                  />
                </div>
              </div>

              {category.sections.map((section) => {
                const sectionIds = sectionSources(section)
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-40 space-y-5">
                    <h3 className="flex flex-wrap items-baseline gap-x-2 border-b border-stone-300 pb-2 text-xl font-semibold text-stone-900">
                      <span className="inline-flex min-w-0 flex-1 flex-wrap items-baseline gap-2">
                        <EditableText
                          value={section.index}
                          onChange={(index) => updateSection(category.id, section.id, { index })}
                          className="w-10 font-semibold"
                        />
                        、
                        <EditableText
                          value={section.title}
                          onChange={(title) => updateSection(category.id, section.id, { title })}
                          className="font-semibold"
                        />
                      </span>
                      <SourceCite ids={sectionIds} className="font-normal" />
                    </h3>
                    {section.topics.map((topic) => {
                      const topicIds = topicSources(topic)
                      return (
                        <div key={topic.id} id={topic.id} className="scroll-mt-40 space-y-3">
                          <h4 className="flex flex-wrap items-baseline gap-x-2 text-base font-semibold text-stone-800">
                            <span className="inline-flex min-w-0 flex-1 flex-wrap items-baseline gap-1 text-[#1f4b3a]">
                              <EditableText
                                value={topic.mark}
                                onChange={(mark) =>
                                  updateTopic(category.id, section.id, topic.id, { mark })
                                }
                                className="w-10 font-semibold text-[#1f4b3a]"
                              />
                              <EditableText
                                value={topic.title}
                                onChange={(title) =>
                                  updateTopic(category.id, section.id, topic.id, { title })
                                }
                                className="font-semibold text-[#1f4b3a]"
                              />
                            </span>
                            <SourceCite
                              ids={sameSources(topicIds, sectionIds) ? [] : topicIds}
                              className="font-normal"
                            />
                          </h4>
                          <div className="space-y-4">
                            {topic.assays.map((assay, assayIndex) => (
                              <AssayCard
                                key={assay.id}
                                assay={assay}
                                headingMark={assayMark(assay, assayIndex)}
                                onMarkChange={(mark) =>
                                  updateAssay(
                                    {
                                      categoryId: category.id,
                                      sectionId: section.id,
                                      topicId: topic.id,
                                      assayId: assay.id,
                                    },
                                    (current) => ({ ...current, mark })
                                  )
                                }
                                parentSources={topicIds}
                                path={{
                                  categoryId: category.id,
                                  sectionId: section.id,
                                  topicId: topic.id,
                                  assayId: assay.id,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </section>
          ))}

          <section id="refs" className="scroll-mt-40 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-stone-900">
              <EditableText value={refsLabel} onChange={setRefsLabel} className="font-semibold" />
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              本页为后续三篇文献加入前的版本。编号对应两篇核心文献：【1】Widjaja-Adhi 2026，【2】Dong 2015。
            </p>
            <Separator className="my-4" />
            <div className="grid gap-4">
              {(Object.keys(sources) as Array<keyof typeof sources>).map((id) => {
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
            <TocNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function PhenotypeApp() {
  return (
    <HandbookProvider>
      <PhenotypeAppInner />
    </HandbookProvider>
  )
}
