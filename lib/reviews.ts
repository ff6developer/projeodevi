// Menü ürün yorumları (client-side prototip).
// Depolama: services/adapters/local/storage. Backend: GET/POST /api/products/:id/reviews.

import { readJSON, writeJSON } from "./services/adapters/local/storage"

const KEY = "menuYorumlar"

export type Review = { puan: number; metin: string; gorsel?: string }
type ReviewMap = Record<number, Review[]>

export function getReviews(): ReviewMap {
  return readJSON<ReviewMap>(KEY, {})
}

export function addReview(productId: number, review: Review): ReviewMap {
  const all = getReviews()
  const next: ReviewMap = { ...all, [productId]: [...(all[productId] ?? []), review] }
  writeJSON(KEY, next)
  return next
}
