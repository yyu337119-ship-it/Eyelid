export function publicPath(path?: string) {
  if (!path) return path
  if (/^(https?:|blob:|data:)/.test(path)) return path
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  if (!base) return path
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`
}
