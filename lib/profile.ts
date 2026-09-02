// Profil verisi (gönderiler, avatar, bio) — client-side prototip.
// Depolama: services/adapters/local/storage. Backend: GET/PATCH /api/me,
// GET/POST/DELETE /api/me/posts. Sözleşme: docs/BACKEND_CONTRACT.md → ProfileService.

import { readRaw, writeRaw, readJSON, writeJSON } from "./services/adapters/local/storage"

const POSTS_KEY = "userPosts"
const AVATAR_KEY = "userAvatar"
const BIO_KEY = "userBio"

const DEFAULT_AVATAR = "/profilikon.png"

export function getProfilePosts<T = unknown>(): T[] {
  return readJSON<T[]>(POSTS_KEY, [])
}

export function saveProfilePosts<T>(posts: T[]): void {
  writeJSON(POSTS_KEY, posts)
}

export function getAvatar(): string {
  return readRaw(AVATAR_KEY) || DEFAULT_AVATAR
}

export function saveAvatar(dataUrl: string): void {
  writeRaw(AVATAR_KEY, dataUrl)
}

export function getBio(): string {
  return readRaw(BIO_KEY) || ""
}

export function saveBio(text: string): void {
  writeRaw(BIO_KEY, text)
}
