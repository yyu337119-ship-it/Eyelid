"use client"

import { useRef, useState, type ReactNode } from "react"
import { BookOpen, Download, Menu, Pencil, RotateCcw, Upload } from "lucide-react"
import { AssayCard } from "@/components/assay-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { abbreviations, sameSources, sectionSources, sources, topicSources } from "@/data/content"
import { SourceCite } from "@/components/source-badge"
import { EditableText } from "@/components/editable-text"
import { HandbookProvider, useHandbook } from "@/lib/handbook-store"

function scrollToId(id: string, onNavigate?: () => void) {
  const target = document.getElementById(id)
  if (target) {
    const header = document.querySelector("header")
    const offset = (header?.getBoundingClientRect().height ?? 96) + 12
    const top = target.getBoundingClientRect().top + window.scrollY - offset
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = "auto"
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" })
    html.style.scrollBehavior = previous
    history.replaceState(null, "", `#${id}`)
  }
  onNavigate?.()
}

function NavButton({
  id,
  className,
  children,
  onNavigate,
}: {
  id: string
  className?: string
  children: ReactNode
  onNavigate?: () => void
}) {
  return (
    <button
      type="button"
      data-jump={id}
      className={className}
      onClick={() => scrollToId(id, onNavigate)}
    >
      {children}
    </button>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { categories } = useHandbook()
  return (
    <nav className="space-y-5 text-sm">
      {categories.map((category) => (
        <div key={category.id}>
          <NavButton
            id={category.id}
            onNavigate={onNavigate}
            className="block w-full text-left font-semibold text-stone-900 hover:text-[#1f4b3a]"
          >
            {category.roman}、{category.title}
          </NavButton>
          <ul className="mt-2 space-y-3 border-l border-stone-200 pl-3">
            {category.sections.map((section) => (
              <li key={section.id}>
                <NavButton
                  id={section.id}
                  onNavigate={onNavigate}
                  className="w-full text-left font-medium text-stone-800 hover:underline"
                >
                  {section.index}、{section.title}
                </NavButton>
                <ul className="mt-1 space-y-1">
                  {section.topics.map((topic) => (
                    <li key={topic.id}>
                      <NavButton
                        id={topic.id}
                        onNavigate={onNavigate}
                        className="block w-full text-left leading-5 text-stone-600 hover:text-stone-900 hover:underline"
                      >
                        {`${topic.mark}${topic.title}`}
                      </NavButton>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <NavButton
        id="refs"
        onNavigate={onNavigate}
        className="block w-full text-left font-semibold text-stone-900"
      >
        参考文献
      </NavButton>
    </nav>
  )
}

function EditToolbar() {
  const { editMode, setEditMode, dirty, hasLegacyEdits, reset, exportJson, importJson, loadLegacyEdits } =
    useHandbook()
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        variant={editMode ? "default" : "outline"}
        size="sm"
        onClick={() => setEditMode(!editMode)}
      >
        <Pencil className="size-3.5" />
        {editMode ? "完成编辑" : "编辑正文"}
      </Button>
      {hasLegacyEdits ? (
        <Button variant="outline" size="sm" onClick={loadLegacyEdits}>
          取出本机旧修改
        </Button>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (window.confirm("恢复为仓库中的原文，并清除本机保存的文字和替换图片？")) void reset()
        }}
        disabled={!dirty}
      >
        <RotateCcw className="size-3.5" />
        恢复原文
      </Button>
      <Button size="sm" onClick={() => void exportJson()}>
        <Download className="size-3.5" />
        导出本机修改
      </Button>
      <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
        <Upload className="size-3.5" />
        导入
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void importJson(file)
          event.target.value = ""
        }}
      />
    </div>
  )
}

function PhenotypeAppInner() {
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    categories,
    intro,
    setIntro,
    dirty,
    hasLegacyEdits,
    updateCategory,
    updateSectionTitle,
    updateTopicTitle,
  } = useHandbook()

  return (
    <div className="min-h-screen bg-[#f6f1e7] text-stone-800">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f6f1e7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
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
            每张图下方可「替换图片」。改文字请点「编辑正文」。这两项只保存在你自己的浏览器里；公开网址显示的是仓库里这一版。
            {dirty ? " 当前这个浏览器里有未写进仓库的本地修改。" : ""}
          </p>
          {hasLegacyEdits ? (
            <div className="mx-auto mb-3 max-w-7xl px-4 sm:px-6">
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950">
                这个浏览器里还有另一套旧存档。若当前页不是你要的版本，可点「取出本机旧修改」。
              </div>
            </div>
          ) : null}
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
                  <span>{category.roman}、</span>
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
                      {section.index}、
                      <EditableText
                        value={section.title}
                        onChange={(title) => updateSectionTitle(category.id, section.id, title)}
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
                          {topic.mark}
                          <EditableText
                            value={topic.title}
                            onChange={(title) =>
                              updateTopicTitle(category.id, section.id, topic.id, title)
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
                        {topic.assays.map((assay) => (
                          <AssayCard
                            key={assay.id}
                            assay={assay}
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
            <h2 className="text-xl font-semibold text-stone-900">参考文献</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              编号【1】～【5】与汇报 PPT 首页一致。本页正文来自你导出的手册修改。
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
            <NavList onNavigate={() => setMenuOpen(false)} />
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
