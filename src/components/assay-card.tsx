"use client"

import type { ReactNode } from "react"
import { Beaker, Eye, FlaskConical, ImageIcon, Plus, Trash2 } from "lucide-react"
import type { Assay } from "@/data/content"
import { SourceCite } from "@/components/source-badge"
import { FigureBlock } from "@/components/figure-block"
import { EditableList, EditableText } from "@/components/editable-text"
import { useHandbook, type AssayPath } from "@/lib/handbook-store"

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Beaker
  label: string
  children: ReactNode
}) {
  return (
    <section className="grid gap-2 sm:grid-cols-[9.5rem_1fr] sm:gap-4">
      <div className="flex items-center gap-2 pt-0.5 text-stone-500">
        <Icon className="size-3.5 shrink-0" />
        <h4 className="text-xs font-semibold tracking-wide uppercase">{label}</h4>
      </div>
      <div>{children}</div>
    </section>
  )
}

export function AssayCard({ assay, path }: { assay: Assay; path: AssayPath }) {
  const { editMode, updateAssay } = useHandbook()
  const markers = assay.markers ?? []
  const pending = assay.pending ?? []
  const stains = assay.stains ?? []

  function patch(updater: (current: Assay) => Assay) {
    updateAssay(path, updater)
  }

  return (
    <article id={assay.id} className="scroll-mt-28 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <header className="mb-4">
        <h4 className="flex flex-wrap items-baseline gap-x-2 text-lg font-semibold leading-snug text-stone-900">
          <EditableText
            value={assay.title}
            onChange={(title) => patch((current) => ({ ...current, title }))}
            className="min-w-[12rem] flex-1 font-semibold"
          />
          <SourceCite ids={assay.sources} className="font-normal" />
        </h4>
      </header>

      <div className="space-y-4">
        <Field icon={Beaker} label="检测手段 / 仪器">
          <EditableList
            items={assay.instruments}
            onChange={(instruments) => patch((current) => ({ ...current, instruments }))}
            addLabel="添加检测手段"
          />
          {editMode || stains.length ? (
            <div className="mt-2">
              <p className="mb-1 text-xs text-stone-500">染色</p>
              {editMode ? (
                <EditableList
                  items={stains}
                  onChange={(next) =>
                    patch((current) => ({ ...current, stains: next.filter(Boolean) }))
                  }
                  addLabel="添加染色"
                />
              ) : (
                <p className="text-sm leading-6 text-stone-700">染色：{stains.join("、")}</p>
              )}
            </div>
          ) : null}
        </Field>

        <Field icon={FlaskConical} label="分子标志物">
          {markers.length || editMode ? (
            <ul className="space-y-2">
              {markers.map((marker, index) => (
                <li key={index} className="rounded-md bg-stone-50 px-3 py-2 text-sm leading-6">
                  {editMode ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <EditableText
                          value={marker.name}
                          placeholder="标志物名称"
                          onChange={(name) =>
                            patch((current) => {
                              const next = [...(current.markers ?? [])]
                              next[index] = { ...next[index], name }
                              return { ...current, markers: next }
                            })
                          }
                          className="font-medium"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            patch((current) => ({
                              ...current,
                              markers: (current.markers ?? []).filter((_, currentIndex) => currentIndex !== index),
                            }))
                          }
                          className="mt-0.5 inline-flex size-7 items-center justify-center rounded-md text-stone-500 hover:bg-white"
                          aria-label="删除标志物"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <EditableText
                        value={marker.role}
                        placeholder="作用 / 解读"
                        onChange={(role) =>
                          patch((current) => {
                            const next = [...(current.markers ?? [])]
                            next[index] = { ...next[index], role }
                            return { ...current, markers: next }
                          })
                        }
                      />
                      <EditableText
                        value={marker.change ?? ""}
                        placeholder="变化（可空）"
                        multiline
                        onChange={(change) =>
                          patch((current) => {
                            const next = [...(current.markers ?? [])]
                            next[index] = { ...next[index], change }
                            return { ...current, markers: next }
                          })
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-stone-900">{marker.name}</span>
                      <span className="text-stone-500"> · {marker.role}</span>
                      {marker.change ? <p className="mt-0.5 text-stone-700">{marker.change}</p> : null}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">本分支以形态学/物理性状为主，无特异分子标志物。</p>
          )}
          {editMode ? (
            <button
              type="button"
              onClick={() =>
                patch((current) => ({
                  ...current,
                  markers: [...(current.markers ?? []), { name: "", role: "", change: "" }],
                }))
              }
              className="mt-2 inline-flex items-center gap-1 text-sm text-[#1f4b3a] hover:underline"
            >
              <Plus className="size-3.5" />
              添加标志物
            </button>
          ) : null}
        </Field>

        <Field icon={Eye} label="观察结果">
          <EditableList
            items={assay.observations}
            onChange={(observations) => patch((current) => ({ ...current, observations }))}
            addLabel="添加观察结果"
          />
          {pending.length || editMode ? (
            <div className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 px-3 py-2">
              <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">笔记待补</p>
              <div className="mt-1">
                <EditableList
                  items={pending}
                  onChange={(next) => patch((current) => ({ ...current, pending: next }))}
                  addLabel="添加待补项"
                />
              </div>
            </div>
          ) : null}
        </Field>

        <Field icon={ImageIcon} label="原文图表">
          {assay.figures.length ? (
            <div className="grid gap-3">
              {assay.figures.map((figure, index) => (
                <FigureBlock
                  key={figure.paperFig + (figure.src ?? "") + index}
                  figure={figure}
                  sources={assay.sources}
                  onPaperFigChange={(paperFig) =>
                    patch((current) => {
                      const figures = [...current.figures]
                      figures[index] = { ...figures[index], paperFig }
                      return { ...current, figures }
                    })
                  }
                  onCaptionChange={(caption) =>
                    patch((current) => {
                      const figures = [...current.figures]
                      figures[index] = { ...figures[index], caption }
                      return { ...current, figures }
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">笔记尚未对应到具体图号；待补原文图。</p>
          )}
        </Field>
      </div>
    </article>
  )
}
