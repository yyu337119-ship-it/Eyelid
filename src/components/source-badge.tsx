import { Badge } from "@/components/ui/badge"
import { sources, type SourceId } from "@/data/content"
import { cn } from "@/lib/utils"

export function SourceBadge({
  source,
  className,
}: {
  source: SourceId
  className?: string
}) {
  const meta = sources[source]
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md border font-medium tracking-wide",
        source === "paper2"
          ? "border-red-200 bg-red-50 text-[#c2301e]"
          : "border-amber-200 bg-amber-50 text-[#9a6b00]",
        className
      )}
    >
      {meta.tag} {meta.short}
    </Badge>
  )
}

export function sourceTitleClass(source: SourceId) {
  return source === "paper2" ? "text-[#c2301e]" : "text-[#9a6b00]"
}
