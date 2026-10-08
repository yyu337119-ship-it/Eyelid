"use client"

import { useEffect, useState } from "react"
import { BookOpen, Menu } from "lucide-react"
import { AssayCard } from "@/components/assay-card"
import { AddEntryButton, ReferenceEntryCard } from "@/components/reference-entries"
import { scrollToId } from "@/components/toc-nav"
import { EditToolbar } from "@/components/edit-toolbar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  abbreviations,
  assayHasSubstance,
  assayMark,
  collectBlockReferences,
  sameSources,
  sectionSources,
  sources,
  topicSources,
} from "@/data/content"
import { SourceCite } from "@/components/source-badge"
import { EditableText } from "@/components/editable-text"
import { TocNav } from "@/components/toc-nav"
import { HandbookProvider, useHandbook } from "@/lib/handbook-store"

import { AnatomyPanel } from "@/components/anatomy-panel"
import { LiteraturePanel } from "@/components/literature-panel"

const sheets = [
  { id: "anatomy", number: "01", title: "正常解剖与生理" },
  { id: "literature", number: "02", title: "文献思路概览" },
  { id: "phenotype", number: "03", title: "眼睑、眼表表型" },
] as const
type SheetId = typeof sheets[number]["id"]

function PhenotypeAppInner() {
  const [activeSheet, setActiveSheet] = useState<SheetId>("anatomy")
  useEffect(() => {
    function syncHash() {
      const hash = window.location.hash.slice(1)
      setActiveSheet(hash.startsWith("literature") ? "literature" : hash && !hash.startsWith("anatomy") ? "phenotype" : "anatomy")
      if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "instant" }))
    }
    syncHash()
    window.addEventListener("hashchange", syncHash)
    return () => window.removeEventListener("hashchange", syncHash)
  }, [])
  function switchSheet(sheet: SheetId) {
    setActiveSheet(sheet)
    window.history.replaceState(null, "", `#${sheet}`)
    window.scrollTo({ top: 0, behavior: "instant" })
  }
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
    addAssay,
    sectionReferences,
    addSectionReference,
    updateReferenceEntry,
    removeReferenceEntry,
    editMode,
    ready,
  } = useHandbook()
  useEffect(() => {
    if (!ready) return
    const hash = window.location.hash.slice(1)
    if (!hash || hash === "anatomy" || hash === "literature" || hash === "phenotype") return
    const frame = window.requestAnimationFrame(() => scrollToId(hash))
    return () => window.cancelAnimationFrame(frame)
  }, [ready])

  return (
    <div className="min-h-screen bg-[#f6f1e7] text-stone-800">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f6f1e7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#1f4b3a] uppercase">
                MOUSE OCULAR ATLAS · 小鼠眼部图谱
              </p>
              <h1 className="truncate text-lg font-semibold text-stone-900 sm:text-xl">
                小鼠眼睑与眼表研究手册
              </h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              className={activeSheet === "phenotype" ? "lg:hidden" : "hidden"}
              onClick={() => setMenuOpen(true)}
              aria-label="打开目录"
            >
              <Menu className="size-4" />
            </Button>
          </div>
          <EditToolbar />
        </div>
        <div className="sheet-tabs" role="tablist" aria-label="手册模块">
          {sheets.map((sheet, index) => <button key={sheet.id} id={`tab-${sheet.id}`} role="tab" aria-selected={activeSheet === sheet.id} aria-controls={`panel-${sheet.id}`} tabIndex={activeSheet === sheet.id ? 0 : -1} onClick={() => switchSheet(sheet.id)} onKeyDown={event => {
            const next = event.key === "ArrowRight" ? (index + 1) % sheets.length : event.key === "ArrowLeft" ? (index + sheets.length - 1) % sheets.length : event.key === "Home" ? 0 : event.key === "End" ? sheets.length - 1 : -1
            if (next < 0) return
            event.preventDefault()
            switchSheet(sheets[next].id)
            document.getElementById(`tab-${sheets[next].id}`)?.focus()
          }}><span>{sheet.number}</span> {sheet.title}</button>)}
          <p className="sheet-status">{dirty ? "● 有未发布的修改" : "解剖 · 生理 · 表型"}</p>
        </div>
      </header>

      <div id="panel-anatomy" role="tabpanel" aria-labelledby="tab-anatomy" hidden={activeSheet !== "anatomy"}>
        <AnatomyPanel active={activeSheet === "anatomy"} />
      </div>
      <div id="panel-literature" role="tabpanel" aria-labelledby="tab-literature" hidden={activeSheet !== "literature"}><LiteraturePanel /></div>
      <div id="panel-phenotype" role="tabpanel" aria-labelledby="tab-phenotype" hidden={activeSheet !== "phenotype"}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="眼睑、眼表表型目录">
          <div className="sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto pr-2">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-stone-500 uppercase"><BookOpen className="size-3.5" />目录</p>
            <TocNav />
          </div>
        </aside>
        <main className="min-w-0 space-y-10 pb-16">
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
                    {section.topics
                      .filter(
                        (topic) =>
                          editMode || Boolean(topic.title.trim()) || topic.assays.some(assayHasSubstance)
                      )
                      .map((topic) => {
                      const topicIds = topicSources(topic)
                      return (
                        <div key={topic.id} id={topic.id} className={`scroll-mt-40 space-y-3 ${topic.parentId ? "ml-3 border-l-2 border-stone-200 pl-3 sm:ml-6 sm:pl-5" : ""}`}>
                          {(editMode || topic.title || topic.mark) && <h4 className="flex flex-wrap items-baseline gap-x-2 text-base font-semibold text-stone-800">
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
                          </h4>}
                          <div className="space-y-4">
                            {topic.assays
                              .filter((assay) => editMode || assayHasSubstance(assay))
                              .map((assay) => (
                              <AssayCard
                                key={assay.id}
                                assay={assay}
                                headingMark={assayMark(assay, topic.assays.findIndex((item) => item.id === assay.id))}
                                assayIndex={topic.assays.findIndex((item) => item.id === assay.id)}
                                assayCount={topic.assays.length}
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
                            <AddEntryButton
                              onClick={() => {
                                const id = addAssay(category.id, section.id, topic.id)
                                window.setTimeout(() => scrollToId(id), 0)
                              }}
                            >
                              添加评价项目
                            </AddEntryButton>
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
              编号对应两篇核心文献：【1】Widjaja-Adhi 2026，【2】Dong 2015。下面这两篇是页面原有文献。再往下的条目可以随时添加，开始是空的。
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
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-stone-900">逐条添加的参考文献</h3>
              <p className="text-sm leading-6 text-stone-600">
                在某个评价项目里点「添加条目」，同一条会出现在这里。在这里删除，评价项目里的那一条也会去掉。从本节列表新加的条目只留在本节，开始同样是空的。
              </p>
              {collectBlockReferences(categories).map(({ entry, assayId, assayTitle }) => (
                <ReferenceEntryCard
                  key={entry.id}
                  entry={entry}
                  origin={assayId ? `来自评价项目：${assayTitle}` : undefined}
                  onJump={assayId ? () => scrollToId(assayId) : undefined}
                  onChange={(patch) => updateReferenceEntry(entry.id, patch)}
                  onRemove={() => {
                    if (!window.confirm("删除这条参考文献？评价项目和本节列表里都会去掉。")) return
                    removeReferenceEntry(entry.id)
                  }}
                />
              ))}
              {sectionReferences.map((entry) => (
                <ReferenceEntryCard
                  key={entry.id}
                  entry={entry}
                  origin="添加于本节列表"
                  onChange={(patch) => updateReferenceEntry(entry.id, patch)}
                  onRemove={() => {
                    if (!window.confirm("删除这条参考文献？")) return
                    removeReferenceEntry(entry.id)
                  }}
                />
              ))}
              <AddEntryButton onClick={() => addSectionReference()}>添加条目</AddEntryButton>
            </div>
          </section>
        </main>
      </div>

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
