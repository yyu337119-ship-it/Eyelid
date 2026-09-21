"use client"

import type { ReactNode } from "react"
import { CornerDownRight } from "lucide-react"
import { assayMark } from "@/data/content"
import { EditableText } from "@/components/editable-text"
import { useHandbook } from "@/lib/handbook-store"

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

function JumpButton({
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

function TocRow({
  id,
  number,
  title,
  suffix = "",
  showNumber = true,
  onNumberChange,
  onTitleChange,
  onNavigate,
  numberClassName,
  titleClassName,
  rowClassName,
}: {
  id: string
  number: string
  title: string
  suffix?: string
  showNumber?: boolean
  onNumberChange: (value: string) => void
  onTitleChange: (value: string) => void
  onNavigate?: () => void
  numberClassName?: string
  titleClassName?: string
  rowClassName?: string
}) {
  const { editMode } = useHandbook()
  if (!editMode) {
    return (
      <JumpButton id={id} onNavigate={onNavigate} className={rowClassName}>
        {showNumber ? (
          <>
            {number}
            {suffix}
          </>
        ) : null}
        {title}
      </JumpButton>
    )
  }
  return (
    <div className="flex items-start gap-1">
      {showNumber ? (
        <>
          <EditableText
            compact
            value={number}
            onChange={onNumberChange}
            className={numberClassName}
          />
          {suffix ? <span className="pt-0.5 text-stone-500">{suffix}</span> : null}
        </>
      ) : null}
      <EditableText
        compact
        value={title}
        onChange={onTitleChange}
        className={titleClassName}
      />
      <button
        type="button"
        onClick={() => scrollToId(id, onNavigate)}
        className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded text-stone-400 hover:bg-stone-200 hover:text-stone-800"
        aria-label={`跳转到${title}`}
      >
        <CornerDownRight className="size-3.5" />
      </button>
    </div>
  )
}

export function TocNav({ onNavigate }: { onNavigate?: () => void }) {
  const {
    categories,
    refsLabel,
    setRefsLabel,
    updateCategory,
    updateSection,
    updateTopic,
    updateAssay,
  } = useHandbook()

  return (
    <nav className="space-y-5 text-sm">
      {categories.map((category) => (
        <div key={category.id}>
          <TocRow
            id={category.id}
            number={category.roman}
            suffix="、"
            title={category.title}
            onNumberChange={(roman) => updateCategory(category.id, { roman })}
            onTitleChange={(title) => updateCategory(category.id, { title })}
            onNavigate={onNavigate}
            numberClassName="w-10 shrink-0 font-semibold"
            titleClassName="flex-1 font-semibold text-stone-900"
            rowClassName="block w-full text-left font-semibold text-stone-900 hover:text-[#1f4b3a]"
          />
          <ul className="mt-2 space-y-3 border-l border-stone-200 pl-3">
            {category.sections.map((section) => (
              <li key={section.id}>
                <TocRow
                  id={section.id}
                  number={section.index}
                  suffix="、"
                  title={section.title}
                  onNumberChange={(index) => updateSection(category.id, section.id, { index })}
                  onTitleChange={(title) => updateSection(category.id, section.id, { title })}
                  onNavigate={onNavigate}
                  numberClassName="w-8 shrink-0 font-medium"
                  titleClassName="flex-1 font-medium text-stone-800"
                  rowClassName="w-full text-left font-medium text-stone-800 hover:underline"
                />
                <ul className="mt-1 space-y-1">
                  {section.topics.map((topic) => (
                    <li key={topic.id}>
                      <TocRow
                        id={topic.id}
                        number={topic.mark}
                        title={topic.title}
                        onNumberChange={(mark) =>
                          updateTopic(category.id, section.id, topic.id, { mark })
                        }
                        onTitleChange={(title) =>
                          updateTopic(category.id, section.id, topic.id, { title })
                        }
                        onNavigate={onNavigate}
                        numberClassName="w-8 shrink-0 text-[#1f4b3a]"
                        titleClassName="flex-1 leading-5 text-stone-600"
                        rowClassName="block w-full text-left leading-5 text-stone-600 hover:text-stone-900 hover:underline"
                      />
                      <ul className="mt-1 space-y-0.5 pl-2">
                        {topic.assays.map((assay, assayIndex) => (
                          <li key={assay.id}>
                            <TocRow
                              id={assay.id}
                              number={assayMark(assay, assayIndex)}
                              title={assay.title}
                              onNumberChange={(mark) =>
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
                              onTitleChange={(title) =>
                                updateAssay(
                                  {
                                    categoryId: category.id,
                                    sectionId: section.id,
                                    topicId: topic.id,
                                    assayId: assay.id,
                                  },
                                  (current) => ({ ...current, title })
                                )
                              }
                              onNavigate={onNavigate}
                              numberClassName="w-10 shrink-0 text-stone-500"
                              titleClassName="flex-1 text-[13px] leading-5 text-stone-500"
                              rowClassName="block w-full text-left text-[13px] leading-5 text-stone-500 hover:text-stone-800 hover:underline"
                            />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <TocRow
        id="refs"
        number=""
        title={refsLabel}
        showNumber={false}
        onNumberChange={() => undefined}
        onTitleChange={setRefsLabel}
        onNavigate={onNavigate}
        titleClassName="flex-1 font-semibold text-stone-900"
        rowClassName="block w-full text-left font-semibold text-stone-900"
      />
    </nav>
  )
}
