const normalizeBase = (val?: string | null) => (val ?? "").replace(/\/$/, "")

const blobBase = normalizeBase(process.env.NEXT_PUBLIC_BLOB_BASE_URL || process.env.BLOB_BASE_URL)
const adminBase = normalizeBase(process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || process.env.ADMIN_API_BASE_URL)

const appendCacheKey = (url: string, cacheKey?: string | number | null) => {
  if (cacheKey === null || cacheKey === undefined) return url
  const key = String(cacheKey).trim()
  if (!key) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}v=${encodeURIComponent(key)}`
}

export const resolveMediaUrl = (
  input?: string | null,
  options?: { placeholder?: string; cacheKey?: string | number | null },
) => {
  const src = input ?? ""
  if (!src) return options?.placeholder ?? ""

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return appendCacheKey(src, options?.cacheKey)
  }

  if (src.startsWith("/uploads/")) {
    const base = blobBase || adminBase
    if (base) return appendCacheKey(`${base}${src}`, options?.cacheKey)
  }

  const resolved = src.startsWith("/") ? src : `/${src}`
  return appendCacheKey(resolved, options?.cacheKey)
}
