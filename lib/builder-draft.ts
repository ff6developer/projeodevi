// Arena/Topluluk → Builder tarif taslağı aktarımı.
// Topluluk yazar ("tarifi kopyala"), Builder bir kez okur ve temizler.
// Depolama: services/adapters/local/storage.

import { readRaw, removeRaw, writeRaw } from "./services/adapters/local/storage"

const KEY = "copiedRecipe"

export function saveBuilderDraft(draft: unknown): void {
  writeRaw(KEY, JSON.stringify(draft))
}

/** Taslağı bir kez oku ve temizle (SSR'de null döner). */
export function takeBuilderDraft(): Record<string, unknown> | null {
  const raw = readRaw(KEY)
  if (!raw) return null
  removeRaw(KEY)
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}
