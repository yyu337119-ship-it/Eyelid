"use client"

import { EditableText } from "@/components/editable-text"
import { anatomyTree, type AnatomyNode } from "@/lib/anatomy-outline"
import { useHandbook } from "@/lib/handbook-store"

export function AnatomyToc({ selected }: { selected: string }) {
  const { anatomy, editMode, updateAnatomyBlock, updateAnatomySection } = useHandbook()
  function nodes(items: AnatomyNode[], depth: number) {
    return <ul className={`anatomy-toc-level anatomy-toc-level-${depth}`}>{items.map(({ block, children }) => <li key={block.id}>
      {editMode ? <div className="anatomy-toc-field"><EditableText value={block.title} ariaLabel={`目录标题：${block.id}`} onChange={title => updateAnatomyBlock(block.id, { title })} compact /></div> : <a href={`#${block.id}`} aria-current={selected === block.id ? "location" : undefined}>{block.title}</a>}
      {children.length > 0 && nodes(children, depth + 1)}
    </li>)}</ul>
  }
  return <nav aria-label="解剖章节目录">{editMode && <p className="anatomy-toc-help">直接修改标题，与正文同步；完成后保存到公开页。</p>}{anatomy.map(section => <div key={section.id} className="anatomy-toc-group">
    <div className="anatomy-toc-section">{editMode ? <EditableText value={section.title} ariaLabel={`目录标题：${section.id}`} onChange={title => updateAnatomySection(section.id, { title })} compact /> : <a href={`#${section.id}`} aria-current={selected === section.id ? "location" : undefined}>{section.title}</a>}</div>
    {nodes(anatomyTree(section.blocks), 2)}
  </div>)}</nav>
}
