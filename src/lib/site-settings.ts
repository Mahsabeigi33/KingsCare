import "server-only"

const baseUrl = process.env.ADMIN_API_BASE_URL
const settingsPath = process.env.ADMIN_API_SITE_SETTINGS_PATH ?? "/api/site-settings"
const authHeaderValue = process.env.ADMIN_API_KEY

const buildHeaders = () => ({
  ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
})

const buildUrl = (path: string = settingsPath) => {
  if (!baseUrl) {
    return null
  }
  try {
    return new URL(path, baseUrl).toString()
  } catch (error) {
    console.error("Invalid admin settings URL", error)
    return null
  }
}

export type SiteSettings = {
  homeHeroAnnouncement: string | null
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const url = buildUrl()
  if (!url) {
    return null
  }

  const response = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate: 600 },
    cache: "force-cache",
  })

  if (!response.ok) {
    console.error("Failed to fetch site settings", response.status)
    return null
  }

  const body = (await response.json()) as SiteSettings | null
  if (!body) return null
  return {
    homeHeroAnnouncement: body.homeHeroAnnouncement ?? null,
  }
}
