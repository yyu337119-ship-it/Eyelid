import phenotypeData from "./phenotype.json"

export type SourceId = "paper1" | "paper2"

export type Marker = {
  name: string
  role: string
  change?: string
}

export type Figure = {
  placement?: "methods" | "results"
  id?: string
  width?: number
  height?: number
  src?: string
  paperFig: string
  caption: string
  pmcUrl?: string
}

export type Assay = {
  evaluation?: string
  methods?: string[]
  metrics?: string[]
  normal?: string[]
  abnormal?: string[]
  statistics?: string[]
  notes?: string[]
  references?: string[]
  id: string
  title: string
  /** 四级编号，缺省按同级顺序写成（1）（2） */
  mark?: string
  sources: SourceId[]
  instruments: string[]
  stains?: string[]
  markers?: Marker[]
  observations: string[]
  figures: Figure[]
  pending?: string[]
}

export type Topic = {
  parentId?: string
  id: string
  mark: string
  title: string
  assays: Assay[]
}

export type Section = {
  id: string
  index: string
  title: string
  topics: Topic[]
}

export type Category = {
  id: string
  roman: string
  title: string
  question: string
  summary: string
  sections: Section[]
}

export const sources = {
  paper1: {
    id: "paper1" as const,
    n: 1,
    cite: "【1】Widjaja-Adhi MAK, et al. IOVS, 2026",
    short: "Widjaja-Adhi MAK, et al. IOVS, 2026",
    title:
      "Pharmacologic Alteration of Meibum Lipid Composition Alleviates Dry Eye Phenotype in Awat2−/− Mice",
    authors: "Widjaja-Adhi MAK, Chung C, Lapierre-Landry M, et al.",
    journal: "Investigative Ophthalmology & Visual Science",
    year: "2026",
    volume: "67(6): 34",
    doi: "10.1167/iovs.67.6.34",
    doiUrl: "https://doi.org/10.1167/iovs.67.6.34",
    noteMap: "对应原笔记文献 [2]",
    model: "Awat2−/− 蒸发性干眼模型；ATR101（nevanimibe）抑制 SOAT1 / 胆固醇酯合成",
  },
  paper2: {
    id: "paper2" as const,
    n: 2,
    cite: "【2】Dong F, et al. Dev Biol, 2015",
    short: "Dong F, et al. Dev Biol, 2015",
    title:
      "Perturbed meibomian gland and tarsal plate morphogenesis by excess TGFα in eyelid stroma",
    authors: "Dong F, Liu CY, Yuan Y, et al.",
    journal: "Developmental Biology",
    year: "2015",
    volume: "406(2): 147–157",
    doi: "10.1016/j.ydbio.2015.09.003",
    doiUrl: "https://doi.org/10.1016/j.ydbio.2015.09.003",
    pmcUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4996271/",
    noteMap: "对应原笔记文献 [5]",
    model:
      "Kera-rtTA/tetO-TGFα（KR/TG）双转基因小鼠，P0–P15 多西环素诱导眼睑基质过表达 TGFα",
  },
} as const

export function formatCites(ids: SourceId[]) {
  return ids.map((id) => sources[id].cite).join("；")
}

export function uniqueSources(ids: SourceId[]): SourceId[] {
  const order: SourceId[] = ["paper1", "paper2"]
  return order.filter((id) => ids.includes(id))
}

export function sameSources(a: SourceId[], b: SourceId[]) {
  const left = uniqueSources(a)
  const right = uniqueSources(b)
  return left.length === right.length && left.every((id, index) => id === right[index])
}

export function topicSources(topic: Topic): SourceId[] {
  return uniqueSources(topic.assays.flatMap((assay) => assay.sources))
}

export function sectionSources(section: Section): SourceId[] {
  return uniqueSources(
    section.topics.flatMap((topic) => topic.assays.flatMap((assay) => assay.sources))
  )
}

export const abbreviations = [
  { abbr: "MG", full: "睑板腺 Meibomian gland" },
  { abbr: "MCJ", full: "皮肤黏膜交界 mucocutaneous junction" },
  { abbr: "TM", full: "睑板肌 tarsal muscle" },
  { abbr: "CPF", full: "下睑囊筋膜 capsulopalpebral fascia" },
  { abbr: "TP", full: "睑板 tarsal plate" },
  { abbr: "OO", full: "眼轮匝肌 orbicularis oculi" },
  { abbr: "CE / FA", full: "胆固醇酯 / 脂肪酸" },
  { abbr: "TBUT / NIBUT", full: "荧光素泪膜破裂时间 / 非侵入性泪膜破裂时间" },
]

export const categories: Category[] = phenotypeData as Category[]

export function assayMark(assay: Pick<Assay, "mark">, index: number) {
  return assay.mark?.trim() || `（${index + 1}）`
}

function filled(value?: string) {
  return Boolean(value?.trim())
}

function filledList(values?: string[]) {
  return (values ?? []).some(filled)
}

/** 标题和卡片内容都空的条目，不进目录也不进正文。 */
export function assayHasSubstance(assay: Assay) {
  if (filled(assay.title)) return true
  if (filledList(assay.instruments) || filledList(assay.stains) || filledList(assay.observations) || filledList(assay.pending)) {
    return true
  }
  if ((assay.markers ?? []).some((marker) => filled(marker.name) || filled(marker.role) || filled(marker.change))) {
    return true
  }
  return (assay.figures ?? []).some(
    (figure) => filled(figure.src) || filled(figure.paperFig) || filled(figure.caption)
  )
}

export function pruneEmptyOutline(tree: Category[]): Category[] {
  return tree
    .map((category) => ({
      ...category,
      sections: category.sections
        .map((section) => ({
          ...section,
          topics: section.topics
            .map((topic) => ({
              ...topic,
              assays: topic.assays.filter(assayHasSubstance),
            }))
            .filter((topic) => filled(topic.title) || topic.assays.length > 0),
        }))
        .filter((section) => filled(section.title) || section.topics.length > 0),
    }))
    .filter((category) => filled(category.title) || category.sections.length > 0)
}

export function withFigureIds(tree: Category[]): Category[] {
  return tree.map((category) => ({
    ...category,
    sections: category.sections.map((section) => ({
      ...section,
      topics: section.topics.map((topic) => ({
        ...topic,
        assays: topic.assays.map((assay, assayIndex) => ({
          ...assay,
          mark: assayMark(assay, assayIndex),
          figures: assay.figures.map((figure, index) => ({
            ...figure,
            id: figure.id ?? `${assay.id}-fig-${index}`,
          })),
        })),
      })),
    })),
  }))
}

export function allAssays() {
  return categories.flatMap((category) =>
    category.sections.flatMap((section) =>
      section.topics.flatMap((topic) =>
        topic.assays.map((assay) => ({
          ...assay,
          categoryId: category.id,
          sectionId: section.id,
          topicId: topic.id,
        }))
      )
    )
  )
}
