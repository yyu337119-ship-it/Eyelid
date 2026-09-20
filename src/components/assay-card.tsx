import type { ReactNode } from "react"
import { Beaker, Eye, FlaskConical, ImageIcon } from "lucide-react"
import type { Assay } from "@/data/content"
import { SourceCite } from "@/components/source-badge"
import { FigureBlock } from "@/components/figure-block"

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

export function AssayCard({ assay }: { assay: Assay }) {
  return (
    <article id={assay.id} className="scroll-mt-28 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <header className="mb-4 space-y-1">
        <h4 className="text-lg font-semibold leading-snug text-stone-900">{assay.title}</h4>
        <SourceCite ids={assay.sources} />
      </header>

      <div className="space-y-4">
        <Field icon={Beaker} label="检测手段 / 仪器">
          <ul className="list-disc space-y-1 pl-4 text-sm leading-6 text-stone-700">
            {assay.instruments.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {assay.stains?.length ? <li>染色：{assay.stains.join("、")}</li> : null}
          </ul>
        </Field>

        <Field icon={FlaskConical} label="分子标志物">
          {assay.markers?.length ? (
            <ul className="space-y-2">
              {assay.markers.map((marker) => (
                <li key={marker.name} className="rounded-md bg-stone-50 px-3 py-2 text-sm leading-6">
                  <span className="font-medium text-stone-900">{marker.name}</span>
                  <span className="text-stone-500"> · {marker.role}</span>
                  {marker.change ? <p className="mt-0.5 text-stone-700">{marker.change}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">本分支以形态学/物理性状为主，无特异分子标志物。</p>
          )}
        </Field>

        <Field icon={Eye} label="观察结果">
          <ul className="list-disc space-y-1 pl-4 text-sm leading-6 text-stone-700">
            {assay.observations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {assay.pending?.length ? (
            <div className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 px-3 py-2">
              <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">笔记待补</p>
              <ul className="mt-1 list-disc pl-4 text-sm leading-6 text-stone-600">
                {assay.pending.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </Field>

        <Field icon={ImageIcon} label="原文图表">
          {assay.figures.length ? (
            <div className="grid gap-3">
              {assay.figures.map((figure) => (
                <FigureBlock key={figure.paperFig + (figure.src ?? "")} figure={figure} sources={assay.sources} />
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
