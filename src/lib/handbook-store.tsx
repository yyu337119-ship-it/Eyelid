"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  categories as defaultCategories,
  withFigureIds,
  type Assay,
  type Category,
  type Figure,
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
import {
  clearGithubToken,
  getGithubToken,
  liveFigurePublicSrc,
  liveFigureRepoPath,
  publishHandbookFiles,
  setGithubToken,
} from "@/lib/github-publish"
import { publicPath } from "@/lib/public-path"

export const HANDBOOK_INTRO =
  "按解剖部位系统评价小鼠眼表异常。目录四级：一、为一级；「1、2、」为二级；「①②」为三级；「（1）（2）」为四级检测卡片。每一级标题后直接标注【1】或【2】。每张卡片写出检测手段/仪器、分子标志物、观察结果和原文图表。"

export const PUBLIC_SITE_URL = "https://yyu337119-ship-it.github.io/Eyelid/"
export const DEFAULT_REFS_LABEL = "参考文献"

/** Unsaved in-browser draft only. Never auto-load eyelid-handbook-edits-v1…v10. */
const DRAFT_KEY = "eyelid-handbook-unsaved-draft-v14"

export type AssayPath = {
  categoryId: string
  sectionId: string
  topicId: string
  assayId: string
}

export type PublishState = {
  status: "idle" | "saving" | "ok" | "error"
  detail: string
}

type PublishedSnapshot = {
  intro: string
  refsLabel: string
  categories: Category[]
}

type HandbookContextValue = {
  editMode: boolean
  setEditMode: (value: boolean) => void
  dirty: boolean
  hasLocalDraft: boolean
  loadedLive: boolean
  intro: string
  setIntro: (value: string) => void
  refsLabel: string
  setRefsLabel: (value: string) => void
  categories: Category[]
  figureUrls: Record<string, string>
  hasGithubToken: boolean
  publishState: PublishState
  saveGithubToken: (token: string) => void
  clearStoredToken: () => void
  publishToGithub: () => Promise<boolean>
  /** Alias used by the header toolbar. Same as publishToGithub. */
  publishToPublic: () => Promise<boolean>
  updateCategory: (
    categoryId: string,
    patch: Partial<Pick<Category, "title" | "question" | "summary" | "roman">>
  ) => void
  updateSection: (
    categoryId: string,
    sectionId: string,
    patch: Partial<Pick<Category["sections"][number], "title" | "index">>
  ) => void
  updateTopic: (
    categoryId: string,
    sectionId: string,
    topicId: string,
    patch: Partial<Pick<Category["sections"][number]["topics"][number], "title" | "mark">>
  ) => void
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

function walkFigures(categories: Category[], visit: (figure: Figure) => void) {
  for (const category of categories) {
    for (const section of category.sections) {
      for (const topic of section.topics) {
        for (const assay of topic.assays) {
          for (const figure of assay.figures) visit(figure)
        }
      }
    }
  }
}

async function fetchPublishedLive(): Promise<{
  intro?: string
  refsLabel?: string
  categories?: Category[]
} | null> {
  const path = publicPath("/live.json")
  if (!path) return null
  try {
    const response = await fetch(`${path}?t=${Date.now()}`, { cache: "no-store" })
    if (!response.ok) return null
    const data = (await response.json()) as {
      intro?: string
      refsLabel?: string
      categories?: Category[]
    }
    if (!data || typeof data !== "object") return null
    return data
  } catch {
    return null
  }
}

async function collectPublishPayload(
  intro: string,
  refsLabel: string,
  categories: Category[],
  figureUrls: Record<string, string>
) {
  const next = withFigureIds(structuredClone(categories))
  const images: { path: string; blob: Blob }[] = []
  const uploaded = new Set<string>()

  async function attach(figure: Figure) {
    const id = figure.id
    if (!id || !figureUrls[id] || uploaded.has(id)) return
    uploaded.add(id)
    const blob = await fetch(figureUrls[id]).then((response) => response.blob())
    images.push({ path: liveFigureRepoPath(id), blob })
    figure.src = liveFigurePublicSrc(id)
  }

  for (const category of next) {
    for (const section of category.sections) {
      for (const topic of section.topics) {
        for (const assay of topic.assays) {
          for (const figure of assay.figures) {
            await attach(figure)
          }
        }
      }
    }
  }

  walkFigures(next, (figure) => {
    const id = figure.id
    if (id && figureUrls[id]) figure.src = liveFigurePublicSrc(id)
  })

  return {
    liveJson: JSON.stringify({ intro, refsLabel, categories: next }, null, 2),
    categories: next,
    images,
  }
}

export function HandbookProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false)
  const [intro, setIntroState] = useState(HANDBOOK_INTRO)
  const [refsLabel, setRefsLabelState] = useState(DEFAULT_REFS_LABEL)
  const [categories, setCategories] = useState<Category[]>(cloneCategories)
  const [textDirty, setTextDirty] = useState(false)
  const [figuresSynced, setFiguresSynced] = useState(true)
  const [figureUrls, setFigureUrls] = useState<Record<string, string>>({})
  const [ready, setReady] = useState(false)
  const [loadedLive, setLoadedLive] = useState(false)
  const [hasLocalDraft, setHasLocalDraft] = useState(false)
  const [hasGithubToken, setHasGithubToken] = useState(false)
  const [publishState, setPublishState] = useState<PublishState>({ status: "idle", detail: "" })
  const publishedRef = useRef<PublishedSnapshot>({
    intro: HANDBOOK_INTRO,
    refsLabel: DEFAULT_REFS_LABEL,
    categories: cloneCategories(),
  })

  useEffect(() => {
    let cancelled = false
    async function hydrate() {
      setHasGithubToken(Boolean(getGithubToken()))
      const live = await fetchPublishedLive()
      if (cancelled) return
      if (live) {
        if (typeof live.intro === "string") setIntroState(live.intro)
        if (typeof live.refsLabel === "string" && live.refsLabel.trim()) {
          setRefsLabelState(live.refsLabel)
        }
        const nextIntro = typeof live.intro === "string" ? live.intro : HANDBOOK_INTRO
        const nextRefs =
          typeof live.refsLabel === "string" && live.refsLabel.trim()
            ? live.refsLabel
            : DEFAULT_REFS_LABEL
        if (Array.isArray(live.categories) && live.categories.length) {
          const next = withFigureIds(live.categories)
          setCategories(next)
          publishedRef.current = { intro: nextIntro, refsLabel: nextRefs, categories: next }
        } else {
          publishedRef.current = {
            intro: nextIntro,
            refsLabel: nextRefs,
            categories: cloneCategories(),
          }
        }
        setLoadedLive(true)
      }

      const draftRaw = window.localStorage.getItem(DRAFT_KEY)
      if (draftRaw) {
        try {
          const parsed = JSON.parse(draftRaw) as {
            intro?: string
            refsLabel?: string
            categories?: Category[]
          }
          if (typeof parsed.intro === "string") setIntroState(parsed.intro)
          if (typeof parsed.refsLabel === "string") setRefsLabelState(parsed.refsLabel)
          if (Array.isArray(parsed.categories) && parsed.categories.length) {
            setCategories(withFigureIds(parsed.categories))
          }
          setTextDirty(true)
          setHasLocalDraft(true)
        } catch {
          window.localStorage.removeItem(DRAFT_KEY)
        }
      }

      try {
        const blobs = await loadAllFigureBlobs()
        if (cancelled) return
        const urls: Record<string, string> = {}
        for (const [id, blob] of Object.entries(blobs)) {
          urls[id] = URL.createObjectURL(blob)
        }
        if (Object.keys(urls).length) {
          setFigureUrls(urls)
          setFiguresSynced(false)
          setHasLocalDraft(true)
        }
      } catch {
        /* IndexedDB unavailable: text edits still work */
      }
      if (!cancelled) setReady(true)
    }
    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!textDirty) {
      window.localStorage.removeItem(DRAFT_KEY)
      return
    }
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ intro, refsLabel, categories }))
    setHasLocalDraft(true)
  }, [ready, textDirty, intro, refsLabel, categories])

  const dirty = textDirty || !figuresSynced

  const setIntro = useCallback((value: string) => {
    setIntroState(value)
    setTextDirty(true)
    setPublishState({ status: "idle", detail: "" })
  }, [])

  const setRefsLabel = useCallback((value: string) => {
    setRefsLabelState(value)
    setTextDirty(true)
    setPublishState({ status: "idle", detail: "" })
  }, [])

  const commit = useCallback((recipe: (prev: Category[]) => Category[]) => {
    setCategories((prev) => recipe(prev))
    setTextDirty(true)
    setPublishState({ status: "idle", detail: "" })
  }, [])

  const updateCategory = useCallback(
    (
      categoryId: string,
      patch: Partial<Pick<Category, "title" | "question" | "summary" | "roman">>
    ) => {
      commit((prev) =>
        prev.map((category) => (category.id === categoryId ? { ...category, ...patch } : category))
      )
    },
    [commit]
  )

  const updateSection = useCallback(
    (
      categoryId: string,
      sectionId: string,
      patch: Partial<Pick<Category["sections"][number], "title" | "index">>
    ) => {
      commit((prev) =>
        prev.map((category) =>
          category.id !== categoryId
            ? category
            : {
                ...category,
                sections: category.sections.map((section) =>
                  section.id === sectionId ? { ...section, ...patch } : section
                ),
              }
        )
      )
    },
    [commit]
  )

  const updateTopic = useCallback(
    (
      categoryId: string,
      sectionId: string,
      topicId: string,
      patch: Partial<Pick<Category["sections"][number]["topics"][number], "title" | "mark">>
    ) => {
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
                          topic.id === topicId ? { ...topic, ...patch } : topic
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
    setFiguresSynced(false)
    setHasLocalDraft(true)
    setPublishState({ status: "idle", detail: "" })
  }, [])

  const restoreFigure = useCallback(async (id: string) => {
    await deleteFigureBlob(id)
    setFigureUrls((prev) => {
      if (prev[id]) URL.revokeObjectURL(prev[id])
      const next = { ...prev }
      delete next[id]
      if (Object.keys(next).length === 0) setFiguresSynced(true)
      return next
    })
    setPublishState({ status: "idle", detail: "" })
  }, [])

  const reset = useCallback(async () => {
    await clearFigureBlobs()
    setFigureUrls((prev) => {
      revokeAll(prev)
      return {}
    })
    setIntroState(publishedRef.current.intro)
    setRefsLabelState(publishedRef.current.refsLabel)
    setCategories(structuredClone(publishedRef.current.categories))
    setTextDirty(false)
    setFiguresSynced(true)
    setHasLocalDraft(false)
    window.localStorage.removeItem(DRAFT_KEY)
    setPublishState({ status: "idle", detail: "" })
  }, [])

  const saveGithubToken = useCallback((token: string) => {
    setGithubToken(token)
    setHasGithubToken(Boolean(token.trim()))
  }, [])

  const clearStoredToken = useCallback(() => {
    clearGithubToken()
    setHasGithubToken(false)
  }, [])

  const publishToGithub = useCallback(async () => {
    const token = getGithubToken()
    if (!token) {
      setPublishState({ status: "error", detail: "NEED_TOKEN" })
      throw new Error("NEED_TOKEN")
    }
    setPublishState({ status: "saving", detail: "正在保存到 GitHub…" })
    try {
      const payload = await collectPublishPayload(intro, refsLabel, categories, figureUrls)
      await publishHandbookFiles({
        token,
        liveJson: payload.liveJson,
        images: payload.images,
      })
      publishedRef.current = { intro, refsLabel, categories: payload.categories }
      setCategories(payload.categories)
      setTextDirty(false)
      setFiguresSynced(true)
      setHasLocalDraft(false)
      window.localStorage.removeItem(DRAFT_KEY)
      await clearFigureBlobs()
      setPublishState({
        status: "ok",
        detail: "已提交到 GitHub。GitHub Actions 约 1 分钟后重建公开页，刷新即可看到。",
      })
      return true
    } catch (error) {
      const detail = error instanceof Error ? error.message : "保存失败"
      setPublishState({ status: "error", detail })
      throw error instanceof Error ? error : new Error(detail)
    }
  }, [intro, refsLabel, categories, figureUrls])

  const exportJson = useCallback(async () => {
    const figures: Record<string, string> = {}
    for (const [id, url] of Object.entries(figureUrls)) {
      const blob = await fetch(url).then((response) => response.blob())
      figures[id] = await blobToDataUrl(blob)
    }
    const payload = JSON.stringify({ intro, refsLabel, categories, figures }, null, 2)
    const blob = new Blob([payload], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "eyelid-handbook-edits.json"
    link.click()
    URL.revokeObjectURL(url)
  }, [intro, refsLabel, categories, figureUrls])

  const importJson = useCallback(async (file: File) => {
    const parsed = JSON.parse(await file.text()) as {
      intro?: string
      refsLabel?: string
      categories?: Category[]
      figures?: Record<string, string>
    }
    if (typeof parsed.intro === "string") setIntroState(parsed.intro)
    if (typeof parsed.refsLabel === "string") setRefsLabelState(parsed.refsLabel)
    if (Array.isArray(parsed.categories) && parsed.categories.length) {
      setCategories(withFigureIds(parsed.categories))
    }
    setTextDirty(true)
    setHasLocalDraft(true)
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
      setFiguresSynced(Object.keys(next).length === 0)
    }
  }, [])

  const value = useMemo(
    () => ({
      editMode,
      setEditMode,
      dirty,
      hasLocalDraft,
      loadedLive,
      intro,
      setIntro,
      refsLabel,
      setRefsLabel,
      categories,
      figureUrls,
      hasGithubToken,
      publishState,
      saveGithubToken,
      clearStoredToken,
      publishToGithub,
      publishToPublic: publishToGithub,
      updateCategory,
      updateSection,
      updateTopic,
      updateAssay,
      replaceFigure,
      restoreFigure,
      reset,
      exportJson,
      importJson,
    }),
    [
      editMode,
      dirty,
      hasLocalDraft,
      loadedLive,
      intro,
      setIntro,
      refsLabel,
      setRefsLabel,
      categories,
      figureUrls,
      hasGithubToken,
      publishState,
      saveGithubToken,
      clearStoredToken,
      publishToGithub,
      updateCategory,
      updateSection,
      updateTopic,
      updateAssay,
      replaceFigure,
      restoreFigure,
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
