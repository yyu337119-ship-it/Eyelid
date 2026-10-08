"use client"

import { type Assay, type SourceId } from "@/data/content"
import { SourceCite } from "@/components/source-badge"
import { FigureBlock } from "@/components/figure-block"
import { EditableList, EditableText } from "@/components/editable-text"
import { useHandbook, type AssayPath } from "@/lib/handbook-store"

const fields = [
  ["methods", "检测方法"], ["metrics", "定量指标"], ["normal", "正常表型"],
  ["abnormal", "异常表型"], ["statistics", "推荐统计方法"], ["notes", "注意事项"], ["references", "参考文献"],
] as const

export function AssayCard({ assay, path, headingMark, onMarkChange }: {
  assay: Assay; path: AssayPath; parentSources: SourceId[]; headingMark: string; onMarkChange: (mark: string) => void
}) {
  const { editMode, updateAssay, restoreFigure } = useHandbook()
  const patch = (updater: (current: Assay) => Assay) => updateAssay(path, updater)
  function figures(placement: "methods" | "results") {
    return <div className="space-y-3">{(assay.figures ?? []).map((figure, index) => (figure.placement ?? "results") === placement ?
      <div key={figure.id ?? index}>
        <p className="mb-2 text-xs font-medium text-stone-500">{placement === "methods" ? "方法与定位图" : "表型与定量结果图"}</p>
        <FigureBlock figure={figure}
          onPaperFigChange={editMode ? paperFig => patch(c => ({ ...c, figures: c.figures.map((f, i) => i === index ? { ...f, paperFig } : f) })) : undefined}
          onCaptionChange={editMode ? caption => patch(c => ({ ...c, figures: c.figures.map((f, i) => i === index ? { ...f, caption } : f) })) : undefined}
          onRemove={editMode ? () => { if (figure.id) void restoreFigure(figure.id); patch(c => ({ ...c, figures: c.figures.filter((_, i) => i !== index) })) } : undefined} />
        {editMode && <label className="mt-2 block text-xs">图片位置 <select value={figure.placement ?? "results"} onChange={e => { const value = e.target.value as "methods" | "results"; patch(c => ({ ...c, figures: c.figures.map((f, i) => i === index ? { ...f, placement: value } : f) })) }}><option value="methods">检测方法之后</option><option value="results">异常表型之后</option></select></label>}
      </div> : null)}</div>
  }
  return <article id={assay.id} className="scroll-mt-40 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
    <h5 className="mb-5 flex gap-2 text-lg font-semibold"><EditableText value={headingMark} onChange={onMarkChange} className="w-12" /><EditableText value={assay.title} onChange={title => patch(c => ({ ...c, title }))} className="flex-1" /></h5>
    <div className="space-y-5">
      <section className="grid gap-2 sm:grid-cols-[8rem_1fr]"><h6 className="text-sm font-semibold text-[#1f4b3a]">评价项目</h6><EditableText value={assay.evaluation ?? assay.title} onChange={evaluation => patch(c => ({ ...c, evaluation }))} multiline /></section>
      {fields.map(([key, label]) => <div key={key} className="space-y-4">
        <section className="grid gap-2 sm:grid-cols-[8rem_1fr]">
          <h6 className="text-sm font-semibold text-[#1f4b3a]">{label}</h6>
          <div><EditableList items={assay[key] ?? (key === "methods" ? assay.instruments : key === "abnormal" ? assay.observations : []) ?? []} onChange={values => patch(c => ({ ...c, [key]: values }))} addLabel={`添加${label}`} />{key === "references" && <SourceCite ids={assay.sources ?? []} />}</div>
        </section>
        {key === "methods" && figures("methods")}
        {key === "abnormal" && figures("results")}
      </div>)}
      {editMode && <button className="rounded bg-[#1f4b3a] px-3 py-2 text-sm text-white" onClick={() => patch(c => ({ ...c, figures: [...(c.figures ?? []), { id: crypto.randomUUID(), paperFig: "新图", caption: "", placement: "results" }] }))}>添加图表</button>}
    </div>
  </article>
}
