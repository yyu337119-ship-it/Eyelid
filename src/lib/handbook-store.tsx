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
  type Assay,
  type Category,
} from "@/data/content"

export const HANDBOOK_INTRO =
  "按解剖部位系统评价小鼠眼表异常。一级为四大分类；其下再分「1、2、」二级和「①②」三级。每一级分支标题后直接标注文献【1】或【2】，不再用红字、黄字区分来源。每张卡片仍固定写出检测手段/仪器、分子标志物、观察结果和原文图表。打开「编辑正文」可直接改文字，修改保存在本机浏览器。"

const STORAGE_KEY = "eyelid-handbook-edits-v1"

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
  intro: string
  setIntro: (value: string) => void
  categories: Category[]
  updateCategory: (categoryId: string, patch: Partial<Pick<Category, "title" | "question" | "summary">>) => void
  updateSectionTitle: (categoryId: string, sectionId: string, title: string) => void
  updateTopicTitle: (categoryId: string, sectionId: string, topicId: string, title: string) => void
  updateAssay: (path: AssayPath, updater: (assay: Assay) => Assay) => void
  reset: () => void
  exportJson: () => void
  importJson: (file: File) => Promise<void>
}

const HandbookContext = createContext<HandbookContextValue | null>(null)

function cloneCategories() {
  return structuredClone(defaultCategories)
}

export function HandbookProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false)
  const [intro, setIntroState] = useState(HANDBOOK_INTRO)
  const [categories, setCategories] = useState<Category[]>(cloneCategories)
  const [dirty, setDirty] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { intro?: string; categories?: Category[] }
        if (typeof parsed.intro === "string") setIntroState(parsed.intro)
        if (Array.isArray(parsed.categories) && parsed.categories.length) {
          setCategories(parsed.categories)
          setDirty(true)
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!dirty) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ intro, categories }))
  }, [ready, dirty, intro, categories])

  const setIntro = useCallback((value: string) => {
    setIntroState(value)
    setDirty(true)
  }, [])

  const commit = useCallback((recipe: (prev: Category[]) => Category[]) => {
    setCategories((prev) => recipe(prev))
    setDirty(true)
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

  const reset = useCallback(() => {
    setIntroState(HANDBOOK_INTRO)
    setCategories(cloneCategories())
    setDirty(false)
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify({ intro, categories }, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "eyelid-handbook-edits.json"
    link.click()
    URL.revokeObjectURL(url)
  }, [intro, categories])

  const importJson = useCallback(async (file: File) => {
    const parsed = JSON.parse(await file.text()) as { intro?: string; categories?: Category[] }
    if (typeof parsed.intro === "string") setIntroState(parsed.intro)
    if (Array.isArray(parsed.categories) && parsed.categories.length) setCategories(parsed.categories)
    setDirty(true)
  }, [])

  const value = useMemo(
    () => ({
      editMode,
      setEditMode,
      dirty,
      intro,
      setIntro,
      categories,
      updateCategory,
      updateSectionTitle,
      updateTopicTitle,
      updateAssay,
      reset,
      exportJson,
      importJson,
    }),
    [
      editMode,
      dirty,
      intro,
      setIntro,
      categories,
      updateCategory,
      updateSectionTitle,
      updateTopicTitle,
      updateAssay,
      reset,
      exportJson,
      importJson,
    ]
  )

  return <HandbookContext.Provider value={value}>{children}</HandbookContext.Provider>
}

export function useHandbook() {
  const value = useContext(HandbookContext)
  if (!value) throw new Error("useHandbook must be used within HandbookProvider")
  return value
}
