"use client"

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { type Assay, type SourceId } from "@/data/content"
import { SourceCite } from "@/components/source-badge"
import { FigureBlock } from "@/components/figure-block"
import { EditableList, EditableText } from "@/components/editable-text"
import { AddEntryButton, ReferenceEntryCard } from "@/components/reference-entries"
import { useHandbook, type AssayPath } from "@/lib/handbook-store"

const fields = [
  ["methods", "检测方法"],
  ["metrics", "定量指标"],
  ["normal", "正常表型"],
  ["abnormal", "异常表型"],
  ["statistics", "推荐统计方法"],
  ["notes", "注意事项"],
] as const

export function AssayCard({
  assay,
  path,
  headingMark,
  onMarkChange,
  assayIndex,
  assayCount,
}: {
  assay: Assay
  path: AssayPath
  parentSources: SourceId[]
  headingMark: string
  onMarkChange: (mark: string) => void
  assayIndex: number
  assayCount: number
}) {
  const { editMode, updateAssay, restoreFigure, moveAssay, removeAssay, addReferenceToAssay, updateReferenceEntry, removeReferenceEntry } =
    useHandbook()
  const patch = (updater: (current: Assay) => Assay) => updateAssay(path, updater)
  const editing = editMode || Boolean(assay.userAdded)
  const label = assay.title.trim() || "未命名评价项目"

  function syncTitle(title: string) {
    patch((current) => ({
      ...current,
      title,
      evaluation: current.userAdded ? title : current.evaluation,
    }))
  }

  function insertFigure(placement: "methods" | "results") {
    patch((current) => ({
      ...current,
      figures: [
        ...(current.figures ?? []),
        {
          id: `user-fig-${crypto.randomUUID()}`,
          paperFig: "",
          caption: "",
          alt: "",
          placement,
          userAdded: true,
        },
      ],
    }))
  }

  function figures(placement: "methods" | "results") {
    return (
      <div className="space-y-3">
        {(assay.figures ?? []).map((figure, index) =>
          (figure.placement ?? "results") === placement ? (
            <div key={figure.id ?? index}>
              <p className="mb-2 text-xs font-medium text-stone-500">
                {placement === "methods" ? "方法与定位图" : "表型与定量结果图"}
              </p>
              <FigureBlock
                figure={figure}
                onPaperFigChange={
                  editing || figure.userAdded
                    ? (paperFig) =>
                        patch((current) => ({
                          ...current,
                          figures: current.figures.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, paperFig } : item
                          ),
                        }))
                    : undefined
                }
                onCaptionChange={
                  editing || figure.userAdded
                    ? (caption) =>
                        patch((current) => ({
                          ...current,
                          figures: current.figures.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, caption } : item
                          ),
                        }))
                    : undefined
                }
                onAltChange={
                  editing || figure.userAdded
                    ? (alt) =>
                        patch((current) => ({
                          ...current,
                          figures: current.figures.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, alt } : item
                          ),
                        }))
                    : undefined
                }
                onRemove={
                  editing || figure.userAdded
                    ? () => {
                        if (figure.id) void restoreFigure(figure.id)
                        patch((current) => ({
                          ...current,
                          figures: current.figures.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    : undefined
                }
              />
              {editMode && (
                <label className="mt-2 block text-xs">
                  图片位置{" "}
                  <select
                    value={figure.placement ?? "results"}
                    onChange={(event) => {
                      const value = event.target.value as "methods" | "results"
                      patch((current) => ({
                        ...current,
                        figures: current.figures.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, placement: value } : item
                        ),
                      }))
                    }}
                  >
                    <option value="methods">检测方法之后</option>
                    <option value="results">异常表型之后</option>
                  </select>
                </label>
              )}
            </div>
          ) : null
        )}
      </div>
    )
  }

  function removeBlock() {
    if (!window.confirm(`删除「${label}」？目录和正文会一起去掉，这条里添加的参考文献也会从本节列表中消失。`)) return
    removeAssay(path)
  }

  return (
    <article id={assay.id} data-user-added={assay.userAdded ? "true" : "false"} className="scroll-mt-40 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => moveAssay(path, -1)}
          disabled={assayIndex === 0}
          className="inline-flex items-center gap-1 rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50 disabled:opacity-40"
        >
          <ChevronUp className="size-3.5" />
          上移
        </button>
        <button
          type="button"
          onClick={() => moveAssay(path, 1)}
          disabled={assayIndex >= assayCount - 1}
          className="inline-flex items-center gap-1 rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50 disabled:opacity-40"
        >
          <ChevronDown className="size-3.5" />
          下移
        </button>
        <button
          type="button"
          onClick={removeBlock}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-stone-500 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="size-3.5" />
          删除本项
        </button>
      </div>
      <h5 className="mb-5 flex gap-2 text-lg font-semibold">
        <EditableText value={headingMark} onChange={onMarkChange} active={editing} className="w-12" ariaLabel="编号" />
        <EditableText
          value={assay.title}
          onChange={syncTitle}
          active={editing}
          placeholder="未命名评价项目"
          ariaLabel="评价项目标题"
          className="flex-1"
        />
      </h5>
      <div className="space-y-5">
        <section className="grid gap-2 sm:grid-cols-[8rem_1fr]">
          <h6 className="text-sm font-semibold text-[#1f4b3a]">评价项目</h6>
          <EditableText
            value={assay.evaluation ?? assay.title}
            onChange={(evaluation) =>
              patch((current) => ({
                ...current,
                evaluation,
                title: current.userAdded ? evaluation : current.title,
              }))
            }
            active={editing}
            multiline
            placeholder="填写评价项目，留空待填"
            ariaLabel="评价项目"
          />
        </section>
        {fields.map(([key, labelText]) => (
          <div key={key} className="space-y-4">
            <section className="grid gap-2 sm:grid-cols-[8rem_1fr]">
              <h6 className="text-sm font-semibold text-[#1f4b3a]">{labelText}</h6>
              <EditableList
                items={assay[key] ?? (key === "methods" ? assay.instruments : key === "abnormal" ? assay.observations : []) ?? []}
                onChange={(values) => patch((current) => ({ ...current, [key]: values }))}
                addLabel={`添加${labelText}`}
                active={editing}
                placeholder="留空待填"
              />
            </section>
            {key === "methods" && (
              <>
                {figures("methods")}
                <AddEntryButton onClick={() => insertFigure("methods")}>插入图片</AddEntryButton>
              </>
            )}
            {key === "abnormal" && (
              <>
                {figures("results")}
                <AddEntryButton onClick={() => insertFigure("results")}>插入图片</AddEntryButton>
              </>
            )}
          </div>
        ))}
        <section className="grid gap-2 sm:grid-cols-[8rem_1fr]">
          <h6 className="text-sm font-semibold text-[#1f4b3a]">参考文献</h6>
          <div className="space-y-3">
            {(assay.references ?? []).length > 0 ? (
              <div>
                <p className="mb-1 text-xs text-stone-500">原文定位</p>
                <EditableList
                  items={assay.references ?? []}
                  onChange={(references) => patch((current) => ({ ...current, references }))}
                  addLabel="添加原文定位"
                  active={editing}
                />
              </div>
            ) : null}
            {(assay.referenceEntries ?? []).map((entry) => (
              <ReferenceEntryCard
                key={entry.id}
                entry={entry}
                origin="与本节参考文献列表是同一条"
                onChange={(next) => updateReferenceEntry(entry.id, next)}
                onRemove={() => {
                  if (!window.confirm("删除这条参考文献？评价项目和本节列表里都会去掉。")) return
                  removeReferenceEntry(entry.id)
                }}
              />
            ))}
            <AddEntryButton onClick={() => addReferenceToAssay(path)}>添加条目</AddEntryButton>
            <SourceCite ids={assay.sources ?? []} />
          </div>
        </section>
      </div>
    </article>
  )
}
