import "server-only"

const baseUrl = process.env.ADMIN_API_BASE_URL
const blogsPath = process.env.ADMIN_API_BLOGS_PATH ?? "/api/blogs"
const authHeaderValue = process.env.ADMIN_API_KEY
export const revalidate = 900;
export type AdminBlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  imageUrl?: string | null
  published: boolean
  createdAt?: string
  updatedAt?: string
}

const buildUrl = (path: string = blogsPath) => {
  if (!baseUrl) {
    return null
  }

  try {
    return new URL(path, baseUrl).toString()
  } catch (error) {
    console.error("Invalid admin blogs URL", error)
    return null
  }
}

const buildHeaders = () => ({
  ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
})

export async function fetchBlogs(): Promise<AdminBlogPost[]> {
  const url = buildUrl()
  if (!url) {
    throw new Error("Admin API base URL is not configured")
  }

  const response = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate }, 
    cache: "force-cache",  
  })

  if (!response.ok) {
    console.error("Failed to fetch blogs", response.status)
    throw new Error("Unable to retrieve blog posts from admin API")
  }

  const body = await response.json()
  if (!Array.isArray(body)) {
    return []
  }

  return body as AdminBlogPost[]
}

export async function fetchPublishedBlogs(limit?: number) {
  const posts = await fetchBlogs()
  const published = posts.filter((post) => post.published)
  return typeof limit === "number" ? published.slice(0, limit) : published
}

export async function fetchBlogBySlug(slug: string) {
  if (!slug) return null
  const posts = await fetchBlogs()
  return posts.find((post) => post.slug === slug) ?? null
}
