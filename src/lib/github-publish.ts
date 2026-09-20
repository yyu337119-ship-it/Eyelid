const TOKEN_KEY = "eyelid-github-token"
export const GITHUB_REPO = "yyu337119-ship-it/Eyelid"
export const GITHUB_BRANCH = "main"

/** Pre-fills Contents = write for the Eyelid repo owner. */
export const TOKEN_HELP_URL =
  "https://github.com/settings/personal-access-tokens/new?name=Eyelid%20handbook%20save&description=Commit%20live.json%20to%20the%20public%20handbook&target_name=yyu337119-ship-it&contents=write"

/** Classic PAT: check public_repo. Easier if the fine-grained permission list is missing. */
export const CLASSIC_TOKEN_HELP_URL =
  "https://github.com/settings/tokens/new?description=Eyelid%20handbook%20save&scopes=public_repo"

export function liveImagePaths(figureId: string) {
  const safe = figureId.replace(/[^a-zA-Z0-9_-]/g, "-")
  return {
    filePath: `public/figures/live/${safe}.jpg`,
    src: `/figures/live/${safe}.jpg`,
  }
}

export function liveFigureRepoPath(figureId: string) {
  return liveImagePaths(figureId).filePath
}

export function liveFigurePublicSrc(figureId: string) {
  return liveImagePaths(figureId).src
}

export function getGithubToken() {
  if (typeof window === "undefined") return ""
  return window.localStorage.getItem(TOKEN_KEY) ?? ""
}

export function setGithubToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token.trim())
}

export function clearGithubToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

function utf8ToBase64(text: string) {
  const bytes = new TextEncoder().encode(text)
  let binary = ""
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

async function blobToBase64(blob: Blob) {
  const buffer = new Uint8Array(await blob.arrayBuffer())
  let binary = ""
  buffer.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

async function github<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(githubError(response.status, body))
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

function githubError(status: number, body: string) {
  if (status === 401) return "令牌无效或已过期，请重新粘贴。"
  if (status === 403) return "令牌没有写入这个仓库的权限。"
  if (status === 404) return "找不到仓库，或令牌看不到 yyu337119-ship-it/Eyelid。"
  return `GitHub 保存失败（${status}）：${body.slice(0, 180)}`
}

type GitRef = { object: { sha: string } }
type GitCommit = { sha: string; tree: { sha: string } }
type GitBlob = { sha: string }
type GitTree = { sha: string }

export async function publishHandbookFiles(args: {
  token: string
  liveJson: string
  images: { path: string; blob: Blob }[]
}) {
  const { token, liveJson, images } = args
  const ref = await github<GitRef>(
    `/repos/${GITHUB_REPO}/git/ref/heads/${GITHUB_BRANCH}`,
    token
  )
  const parentSha = ref.object.sha
  const parent = await github<GitCommit>(
    `/repos/${GITHUB_REPO}/git/commits/${parentSha}`,
    token
  )

  const files = [
    { path: "public/live.json", content: utf8ToBase64(liveJson) },
    ...(await Promise.all(
      images.map(async (image) => ({
        path: image.path,
        content: await blobToBase64(image.blob),
      }))
    )),
  ]

  const blobs = await Promise.all(
    files.map((file) =>
      github<GitBlob>(`/repos/${GITHUB_REPO}/git/blobs`, token, {
        method: "POST",
        body: JSON.stringify({ content: file.content, encoding: "base64" }),
      })
    )
  )

  const tree = await github<GitTree>(`/repos/${GITHUB_REPO}/git/trees`, token, {
    method: "POST",
    body: JSON.stringify({
      base_tree: parent.tree.sha,
      tree: files.map((file, index) => ({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blobs[index].sha,
      })),
    }),
  })

  const commit = await github<GitCommit>(`/repos/${GITHUB_REPO}/git/commits`, token, {
    method: "POST",
    body: JSON.stringify({
      message: "Update handbook from the public web editor",
      tree: tree.sha,
      parents: [parentSha],
    }),
  })

  await github(`/repos/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`, token, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  })

  return commit.sha
}
