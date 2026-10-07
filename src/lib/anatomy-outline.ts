import type { AnatomyBlock, AnatomySection } from "@/data/anatomy"

const parents: Record<string, string> = {
  "anatomy-mcj": "anatomy-skin",
  "anatomy-mg": "anatomy-glands",
  "anatomy-lacrimal": "anatomy-glands",
  "anatomy-zeis": "anatomy-glands",
  "anatomy-tarsal": "anatomy-support",
  "anatomy-muscles": "anatomy-support",
  "anatomy-orbicularis": "anatomy-muscles",
  "anatomy-levator": "anatomy-muscles",
  "anatomy-orbital": "anatomy-muscles",
  "anatomy-goblet": "anatomy-conjunctiva",
  "anatomy-tfbut": "anatomy-tearfilm",
}

const originalTitles: Record<string, [string, string]> = {
  "anatomy-gross": ["01 · 大体解剖", "1、大体解剖"],
  "anatomy-skin": ["02 · 皮肤和黏膜", "2、皮肤和黏膜"],
  "anatomy-mcj": ["皮肤黏膜交界 · MCJ", "① 皮肤黏膜交界 · MCJ"],
  "anatomy-mg": ["03 · 腺体 / ① 睑板腺 MG", "① 睑板腺 MG"],
  "anatomy-support": ["04 · 支撑结构：睑板与肌肉", "4、支撑结构：睑板与肌肉"],
  "anatomy-orbicularis": ["② 肌层 / 眼轮匝肌", "（1）眼轮匝肌"],
  "anatomy-levator": ["上睑提肌、上直肌", "（2）上睑提肌、上直肌"],
  "anatomy-orbital": ["眶肌", "（3）眶肌"],
  "anatomy-cornea": ["01 · 角膜", "1、角膜"],
  "anatomy-conjunctiva": ["02 · 结膜", "2、结膜"],
  "anatomy-goblet": ["杯状细胞在睑结膜中的分布", "① 杯状细胞在睑结膜中的分布"],
  "anatomy-tearfilm": ["03 · 泪膜", "3、泪膜"],
  "anatomy-tfbut": ["泪膜破裂时间 · TFBUT", "① 泪膜破裂时间 · TFBUT"],
}

/** Upgrade older saved pages/drafts without replacing the reader's edited titles or figures. */
export function normalizeAnatomy(input: AnatomySection[]): AnatomySection[] {
  const sections = structuredClone(input)
  for (const section of sections) {
    if (section.id === "anatomy-eyelid") {
      const groups = [
        { id: "anatomy-glands", title: "3、腺体", before: "anatomy-mg" },
        { id: "anatomy-muscles", title: "② 肌层", before: "anatomy-orbicularis" },
      ]
      for (const group of groups) {
        const index = section.blocks.findIndex(block => block.id === group.before)
        if (index >= 0 && !section.blocks.some(block => block.id === group.id)) {
          section.blocks.splice(index, 0, { id: group.id, title: group.title, kind: "group", paragraphs: [], sources: [], figures: [] })
        }
      }
    }
    for (const block of section.blocks) {
      if (block.id === section.id && section.id === "anatomy-overview") block.id = "anatomy-overview-figure"
      if (!block.parentId && parents[block.id] && section.blocks.some(parent => parent.id === parents[block.id])) block.parentId = parents[block.id]
      const title = originalTitles[block.id]
      if (section.outlineVersion !== 1 && title && block.title === title[0]) block.title = title[1]
    }
    section.outlineVersion = 1
  }
  return sections
}

export type AnatomyNode = { block: AnatomyBlock; children: AnatomyNode[] }

export function anatomyTree(blocks: AnatomyBlock[]): AnatomyNode[] {
  const nodes = new Map(blocks.map(block => [block.id, { block, children: [] as AnatomyNode[] }]))
  const roots: AnatomyNode[] = []
  for (const block of blocks) {
    const node = nodes.get(block.id)!
    const parent = block.parentId ? nodes.get(block.parentId) : undefined
    if (parent && parent !== node) parent.children.push(node)
    else roots.push(node)
  }
  return roots
}
