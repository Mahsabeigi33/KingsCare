const normalizeBase = (val?: string | null) => (val ?? "").replace(/\/$/, "")

const blobBase = normalizeBase(process.env.NEXT_PUBLIC_BLOB_BASE_URL || process.env.BLOB_BASE_URL)
const adminBase = normalizeBase(process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || process.env.ADMIN_API_BASE_URL)

export const resolveMediaUrl = (input?: string | null, options?: { placeholder?: string }) => {
  const src = input ?? ""
  if (!src) return options?.placeholder ?? ""

  if (src.startsWith("http://") || src.startsWith("https://")) return src

  if (src.startsWith("/uploads/")) {
    const base = blobBase || adminBase
    if (base) return `${base}${src}`
  }

  return src.startsWith("/") ? src : `/${src}`
}
