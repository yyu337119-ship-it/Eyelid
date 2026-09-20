"use client"

import { useState } from "react"
import { CloudUpload, KeyRound, Pencil, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PUBLIC_SITE_URL, useHandbook } from "@/lib/handbook-store"
import {
  CLASSIC_TOKEN_HELP_URL,
  getGithubToken,
  GITHUB_REPO,
  TOKEN_HELP_URL,
} from "@/lib/github-publish"

export function EditToolbar() {
  const {
    editMode,
    setEditMode,
    dirty,
    reset,
    publishToPublic,
    publishState,
    hasGithubToken,
    saveGithubToken,
    clearStoredToken,
  } = useHandbook()
  const [tokenOpen, setTokenOpen] = useState(false)
  const [token, setToken] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const busy = publishState.status === "saving"
  const statusMessage =
    message ??
    (publishState.status === "ok" || publishState.status === "saving" ? publishState.detail : null)
  const statusError =
    error ??
    (publishState.status === "error" && publishState.detail !== "NEED_TOKEN"
      ? publishState.detail
      : null)

  async function runPublish() {
    setError(null)
    setMessage("正在写入 GitHub…")
    try {
      await publishToPublic()
      setMessage("已提交到公开页。GitHub Actions 约 1 分钟后重建，刷新即可看到。")
    } catch (caught) {
      const text = caught instanceof Error ? caught.message : "保存失败"
      if (text === "NEED_TOKEN" || text === "NO_TOKEN") {
        setToken("")
        setTokenOpen(true)
        setMessage(null)
      } else {
        setError(text)
        setMessage(null)
      }
    }
  }

  function onSaveClick() {
    if (!hasGithubToken && !getGithubToken()) {
      setToken("")
      setTokenOpen(true)
      return
    }
    void runPublish()
  }

  function onToggleEdit() {
    if (editMode && dirty) {
      const leave = window.confirm(
        "改动还没点「保存到公开页」。退出编辑不会发布，这个浏览器里暂时还在，但别人看不到。仍要退出编辑？"
      )
      if (!leave) return
    }
    setEditMode(!editMode)
  }

  function onReset() {
    if (!window.confirm("恢复为目前公开页上的内容，并丢掉这次未保存的修改？")) return
    void reset()
    setMessage(null)
    setError(null)
  }

  async function onSaveToken() {
    const next = token.trim()
    if (!next) {
      setError("请先粘贴 GitHub 令牌。")
      return
    }
    saveGithubToken(next)
    setTokenOpen(false)
    setToken("")
    await runPublish()
  }

  function onClearToken() {
    clearStoredToken()
    setToken("")
  }

  return (
    <>
      <div className="flex w-full flex-col items-stretch gap-2 lg:w-auto lg:items-end">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            size="lg"
            className="bg-[#1f4b3a] px-4 font-semibold text-white shadow-sm hover:bg-[#17382c]"
            onClick={onSaveClick}
            disabled={busy}
            aria-label="保存到公开页"
          >
            <CloudUpload className="size-4" />
            {busy ? "保存中…" : "保存到公开页"}
          </Button>
          <Button variant={editMode ? "default" : "outline"} size="sm" onClick={onToggleEdit}>
            <Pencil className="size-3.5" />
            {editMode ? "退出编辑" : "编辑正文"}
          </Button>
          <Button variant="outline" size="sm" onClick={onReset} disabled={!dirty || busy}>
            <RotateCcw className="size-3.5" />
            恢复原文
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setToken(getGithubToken())
              setTokenOpen(true)
            }}
          >
            <KeyRound className="size-3.5" />
            {hasGithubToken ? "令牌" : "设置令牌"}
          </Button>
        </div>
        {statusMessage ? (
          <p className="w-full text-right text-xs text-[#1f4b3a]">{statusMessage}</p>
        ) : null}
        {statusError ? <p className="w-full text-right text-xs text-red-700">{statusError}</p> : null}
      </div>

      <Dialog open={tokenOpen} onOpenChange={setTokenOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl" showCloseButton>
          <DialogHeader>
            <DialogTitle>保存到公开页需要 GitHub 令牌</DialogTitle>
            <DialogDescription>
              必须用账号 <span className="font-medium text-stone-800">yyu337119-ship-it</span>{" "}
              登录。令牌只存在这个浏览器，用来把改动提交到 {GITHUB_REPO}。约 1 分钟后{" "}
              <a className="underline" href={PUBLIC_SITE_URL} target="_blank" rel="noreferrer">
                公开页
              </a>{" "}
              会更新。
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-6 text-stone-700">
            GitHub 没有一条叫「Repository permissions → Contents：Read and write」的菜单。那是两步：先展开
            Permissions 列表，再把 Contents 这一行右边的下拉从 No access 改成 Read and write。
          </p>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-6 text-stone-700">
            <li>
              用这个{" "}
              <a className="font-medium underline" href={TOKEN_HELP_URL} target="_blank" rel="noreferrer">
                预填好 Contents 的链接
              </a>
              打开新建页（Contents 应已是 Read and write）。
            </li>
            <li>
              Resource owner 选 <span className="font-medium">yyu337119-ship-it</span>（必须是这个账号）。
            </li>
            <li>
              Repository access 选 <span className="font-medium">Only select repositories</span>
              ，再选仓库 <span className="font-medium">Eyelid</span>。
            </li>
            <li>
              往下滚到 <span className="font-medium">Permissions</span>（中文界面叫「权限」），点开{" "}
              <span className="font-medium">Repository permissions</span>（「存储库权限」）。
            </li>
            <li>
              找到 <span className="font-medium">Contents</span>（「内容」）这一行，右侧下拉选{" "}
              <span className="font-medium">Read and write</span>（「读取和写入」）。默认是 No access。
            </li>
            <li>Generate token，复制后粘贴到下面。</li>
          </ol>
          <p className="text-sm leading-6 text-stone-600">
            还是没有 Contents 这一行，改用更简单的经典令牌：打开{" "}
            <a className="underline" href={CLASSIC_TOKEN_HELP_URL} target="_blank" rel="noreferrer">
              新建 classic token
            </a>
            ，勾选 <span className="font-medium">public_repo</span>，Generate 后同样粘贴到下面。
          </p>
          <label className="block text-sm font-medium text-stone-800">
            令牌
            <input
              type="password"
              autoComplete="off"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="github_pat_… 或 ghp_…"
              className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-mono text-sm"
            />
          </label>
          <DialogFooter>
            {hasGithubToken ? (
              <Button variant="outline" onClick={onClearToken}>
                清除令牌
              </Button>
            ) : null}
            <Button
              className="bg-[#1f4b3a] text-white hover:bg-[#17382c]"
              onClick={() => void onSaveToken()}
              disabled={busy}
            >
              {busy ? "保存中…" : "保存令牌并发布"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
