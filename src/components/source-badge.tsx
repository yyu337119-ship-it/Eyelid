import { sources, formatCites, type SourceId } from "@/data/content"
import { cn } from "@/lib/utils"

export function SourceCite({
  ids,
  className,
}: {
  ids: SourceId[]
  className?: string
}) {
  if (!ids.length) return null
  return (
    <span className={cn("text-sm font-medium text-stone-600", className)}>
      {formatCites(ids)}
    </span>
  )
}

export function RefIndex({ id }: { id: SourceId }) {
  return <span className="font-medium text-stone-800">{sources[id].cite}</span>
}
