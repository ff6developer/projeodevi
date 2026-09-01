// Topluluk seçkisi — takvim ayına bağlı dönem mantığı (client-side prototip).
// Seçki her ayın 1'inde yenilenir; kalan gün = ay sonuna kadar.

const PERIOD_KEY = "arenaPeriod"
const POSTS_KEY = "arenaPosts"
const CHAMPION_KEY = "arenaChampion"

/** Geçerli dönem anahtarı, ör. "2026-09". */
export function getCurrentPeriodKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

/** İçinde bulunduğumuz ayın sonuna kadar kalan tam gün sayısı. */
export function getRemainingDays(d: Date = new Date()): number {
  const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
  const ms = endOfMonth.getTime() - d.getTime()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

type Post = {
  likes?: number
  userName?: string
  coffee?: { name?: string; image?: string | null }
}

/**
 * Dönem değiştiyse: önceki dönemin en çok oy alanını "öne çıkan" olarak
 * arşivler ve seçkiyi sıfırlar. Değişmediyse gönderileri aynen döndürür.
 */
export function rollOverIfNeeded(posts: Post[]): Post[] {
  if (typeof window === "undefined") return posts

  const current = getCurrentPeriodKey()
  const stored = window.localStorage.getItem(PERIOD_KEY)

  if (!stored) {
    window.localStorage.setItem(PERIOD_KEY, current)
    return posts
  }

  if (stored === current) return posts

  // Yeni döneme geçildi.
  if (posts.length > 0) {
    const winner = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0]
    window.localStorage.setItem(
      CHAMPION_KEY,
      JSON.stringify({
        name: winner.coffee?.name ?? "İsimsiz Kahve",
        creator: winner.userName ?? "",
        image: winner.coffee?.image ?? null,
        period: stored,
      }),
    )
  }
  window.localStorage.setItem(POSTS_KEY, JSON.stringify([]))
  window.localStorage.setItem(PERIOD_KEY, current)
  return []
}
