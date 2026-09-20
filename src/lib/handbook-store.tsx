"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  categories as defaultCategories,
  withFigureIds,
  type Assay,
  type Category,
} from "@/data/content"
import {
  blobToDataUrl,
  clearFigureBlobs,
  dataUrlToBlob,
  deleteFigureBlob,
  fileToJpegBlob,
  loadAllFigureBlobs,
  putFigureBlob,
} from "@/lib/figure-db"

export const HANDBOOK_INTRO =
  "按解剖部位系统评价小鼠眼表异常。一级为四大分类；其下再分「1、2、」二级和「①②」三级。每一级分支标题后直接标注【1】或【2】。每张卡片写出检测手段/仪器、分子标志物、观察结果和原文图表。"

export const PUBLIC_SITE_URL = "https://yyu337119-ship-it.github.io/Eyelid/"

const STORAGE_KEY = "eyelid-handbook-edits-v10"

function readLegacyRaw() {
  if (typeof window === "undefined") return null
  const found: { key: string; raw: string }[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (!key || !key.startsWith("eyelid-handbook-edits-") || key === STORAGE_KEY) continue
    const raw = window.localStorage.getItem(key)
    if (raw) found.push({ key, raw })
  }
  found.sort((a, b) => b.key.localeCompare(a.key, undefined, { numeric: true }))
  return found[0] ?? null
}

export type AssayPath = {
  categoryId: string
  sectionId: string
  topicId: string
  assayId: string
}

type HandbookContextValue = {
  editMode: boolean
  setEditMode: (value: boolean) => void
  dirty: boolean
  hasLegacyEdits: boolean
  intro: string
  setIntro: (value: string) => void
  categories: Category[]
  figureUrls: Record<string, string>
  loadLegacyEdits: () => void
  updateCategory: (categoryId: string, patch: Partial<Pick<Category, "title" | "question" | "summary">>) => void
  updateSectionTitle: (categoryId: string, sectionId: string, title: string) => void
  updateTopicTitle: (categoryId: string, sectionId: string, topicId: string, title: string) => void
  updateAssay: (path: AssayPath, updater: (assay: Assay) => Assay) => void
  replaceFigure: (id: string, file: File) => Promise<void>
  restoreFigure: (id: string) => Promise<void>
  reset: () => Promise<void>
  exportJson: () => Promise<void>
  importJson: (file: File) => Promise<void>
}

const HandbookContext = createContext<HandbookContextValue | null>(null)

function cloneCategories() {
  return withFigureIds(structuredClone(defaultCategories))
}

function revokeAll(urls: Record<string, string>) {
  Object.values(urls).forEach((url) => URL.revokeObjectURL(url))
}

export function HandbookProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false)
  const [intro, setIntroState] = useState(HANDBOOK_INTRO)
  const [categories, setCategories] = useState<Category[]>(cloneCategories)
  const [textDirty, setTextDirty] = useState(false)
  const [figureUrls, setFigureUrls] = useState<Record<string, string>>({})
  const [ready, setReady] = useState(false)
  const [hasLegacyEdits, setHasLegacyEdits] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  const dirty = textDirty || Object.keys(figureUrls).length > 0

  const setIntro = useCallback((value: string) => {
    setIntroState(value)
    setTextDirty(true)
  }, [])

  const commit = useCallback((recipe: (prev: Category[]) => Category[]) => {
    setCategories((prev) => recipe(prev))
    setTextDirty(true)
  }, [])

  const updateCategory = useCallback(
    (categoryId: string, patch: Partial<Pick<Category, "title" | "question" | "summary">>) => {
      commit((prev) =>
        prev.map((category) => (category.id === categoryId ? { ...category, ...patch } : category))
      )
    },
    [commit]
  )

  const updateSectionTitle = useCallback(
    (categoryId: string, sectionId: string, title: string) => {
      commit((prev) =>
        prev.map((category) =>
          category.id !== categoryId
            ? category
            : {
                ...category,
                sections: category.sections.map((section) =>
                  section.id === sectionId ? { ...section, title } : section
                ),
              }
        )
      )
    },
    [commit]
  )

  const updateTopicTitle = useCallback(
    (categoryId: string, sectionId: string, topicId: string, title: string) => {
      commit((prev) =>
        prev.map((category) =>
          category.id !== categoryId
            ? category
            : {
                ...category,
                sections: category.sections.map((section) =>
                  section.id !== sectionId
                    ? section
                    : {
                        ...section,
                        topics: section.topics.map((topic) =>
                          topic.id === topicId ? { ...topic, title } : topic
                        ),
                      }
                ),
              }
        )
      )
    },
    [commit]
  )

  const updateAssay = useCallback(
    (path: AssayPath, updater: (assay: Assay) => Assay) => {
      commit((prev) =>
        prev.map((category) =>
          category.id !== path.categoryId
            ? category
            : {
                ...category,
                sections: category.sections.map((section) =>
                  section.id !== path.sectionId
                    ? section
                    : {
                        ...section,
                        topics: section.topics.map((topic) =>
                          topic.id !== path.topicId
                            ? topic
                            : {
                                ...topic,
                                assays: topic.assays.map((assay) =>
                                  assay.id === path.assayId ? updater(assay) : assay
                                ),
                              }
                        ),
                      }
                ),
              }
        )
      )
    },
    [commit]
  )

  const replaceFigure = useCallback(async (id: string, file: File) => {
    const blob = await fileToJpegBlob(file)
    await putFigureBlob(id, blob)
    setFigureUrls((prev) => {
      if (prev[id]) URL.revokeObjectURL(prev[id])
      return { ...prev, [id]: URL.createObjectURL(blob) }
    })
  }, [])

  const restoreFigure = useCallback(async (id: string) => {
    await deleteFigureBlob(id)
    setFigureUrls((prev) => {
      if (prev[id]) URL.revokeObjectURL(prev[id])
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const reset = useCallback(async () => {
    await clearFigureBlobs()
    setFigureUrls((prev) => {
      revokeAll(prev)
      return {}
    })
    setIntroState(HANDBOOK_INTRO)
    setCategories(cloneCategories())
    setTextDirty(false)
  }, [])

  const loadLegacyEdits = useCallback(() => {
    const legacy = readLegacyRaw()
    if (!legacy) return
    try {
      const parsed = JSON.parse(legacy.raw) as { intro?: string; categories?: Category[] }
      if (typeof parsed.intro === "string") setIntroState(parsed.intro)
      if (Array.isArray(parsed.categories) && parsed.categories.length) {
        setCategories(withFigureIds(parsed.categories))
        setTextDirty(true)
      }
      setHasLegacyEdits(false)
    } catch {
      window.localStorage.removeItem(legacy.key)
      setHasLegacyEdits(false)
    }
  }, [])

  const exportJson = useCallback(async () => {
    const figures: Record<string, string> = {}
    for (const [id, url] of Object.entries(figureUrls)) {
      const blob = await fetch(url).then((response) => response.blob())
      figures[id] = await blobToDataUrl(blob)
    }
    const payload = JSON.stringify({ intro, categories, figures }, null, 2)
    const blob = new Blob([payload], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "eyelid-handbook-edits.json"
    link.click()
    URL.revokeObjectURL(url)
  }, [intro, categories, figureUrls])

  const importJson = useCallback(async (file: File) => {
    const parsed = JSON.parse(await file.text()) as {
      intro?: string
      categories?: Category[]
      figures?: Record<string, string>
    }
    if (typeof parsed.intro === "string") setIntroState(parsed.intro)
    if (Array.isArray(parsed.categories) && parsed.categories.length) {
      setCategories(withFigureIds(parsed.categories))
    }
    setTextDirty(true)
    if (parsed.figures && typeof parsed.figures === "object") {
      await clearFigureBlobs()
      setFigureUrls((prev) => {
        revokeAll(prev)
        return {}
      })
      const next: Record<string, string> = {}
      for (const [id, dataUrl] of Object.entries(parsed.figures)) {
        const blob = await dataUrlToBlob(dataUrl)
        await putFigureBlob(id, blob)
        next[id] = URL.createObjectURL(blob)
      }
      setFigureUrls(next)
    }
  }, [])

  const value = useMemo(
    () => ({
      editMode,
      setEditMode,
      dirty,
      hasLegacyEdits,
      intro,
      setIntro,
      categories,
      figureUrls,
      updateCategory,
      updateSectionTitle,
      updateTopicTitle,
      updateAssay,
      replaceFigure,
      restoreFigure,
      reset,
      exportJson,
      importJson,
      loadLegacyEdits,
    }),
    [
      editMode,
      dirty,
      hasLegacyEdits,
      intro,
      setIntro,
      categories,
      figureUrls,
      updateCategory,
      updateSectionTitle,
      updateTopicTitle,
      updateAssay,
      replaceFigure,
      restoreFigure,
      reset,
      exportJson,
      importJson,
      loadLegacyEdits,
    ]
  )

  return <HandbookContext.Provider value={value}>{children}</HandbookContext.Provider>
}

export function useHandbook() {
  const value = useContext(HandbookContext)
  if (!value) throw new Error("useHandbook must be used within HandbookProvider")
  return value
}
