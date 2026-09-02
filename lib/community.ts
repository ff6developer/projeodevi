// Topluluk seçkisi — takvim ayına bağlı dönem mantığı.
// CommunityService'in LOCAL adapter'ının bir parçası; depolamaya yalnızca
// `services/adapters/local/storage` üzerinden erişir.

import { readRaw, writeRaw, readJSON, writeJSON } from "./services/adapters/local/storage"

const PERIOD_KEY = "arenaPeriod"
const POSTS_KEY = "arenaPosts"
const CHAMPION_KEY = "arenaChampion"
const VOTES_KEY = "userVotes"

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
  const current = getCurrentPeriodKey()
  const stored = readRaw(PERIOD_KEY)

  if (!stored) {
    writeRaw(PERIOD_KEY, current)
    return posts
  }

  if (stored === current) return posts

  // Yeni döneme geçildi.
  if (posts.length > 0) {
    const winner = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0]
    writeRaw(
      CHAMPION_KEY,
      JSON.stringify({
        name: winner.coffee?.name ?? "İsimsiz Kahve",
        creator: winner.userName ?? "",
        image: winner.coffee?.image ?? null,
        period: stored,
      }),
    )
  }
  writeRaw(POSTS_KEY, JSON.stringify([]))
  writeRaw(PERIOD_KEY, current)
  return []
}

/* --------------------------- seçki gönderileri --------------------------- */
// Not: Post şekli bileşenlerde tanımlı; burada minimum `{ id: number }` yeter.
// Backend: GET/POST/DELETE /api/community/posts, POST /api/community/posts/:id/vote.

export function listCommunityPosts<T = unknown>(): T[] {
  return readJSON<T[]>(POSTS_KEY, [])
}

export function saveCommunityPosts<T>(posts: T[]): void {
  writeJSON(POSTS_KEY, posts)
}

export function prependCommunityPost<T>(post: T): void {
  writeJSON(POSTS_KEY, [post, ...listCommunityPosts<T>()])
}

export function removeCommunityPost(id: number): void {
  const next = listCommunityPosts<{ id: number }>().filter((p) => p.id !== id)
  writeJSON(POSTS_KEY, next)
}

export function getVotedPostIds(): number[] {
  return readJSON<number[]>(VOTES_KEY, [])
}

export function saveVotedPostIds(ids: number[]): void {
  writeJSON(VOTES_KEY, ids)
}

/** Önceki dönemin öne çıkan tasarımı (varsa). */
export function getChampion<T = { name: string; creator: string; image?: string | null }>(): T | null {
  return readJSON<T | null>(CHAMPION_KEY, null)
}
