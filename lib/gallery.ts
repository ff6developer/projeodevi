// Tasarlanan kahveler galerisi ("Kahvelerim").
// Builder yazar; Profil ve Admin okur. Depolama: services/adapters/local/storage.
// Backend: GET/POST /api/me/coffees. Sözleşme: docs/BACKEND_CONTRACT.md.

import { readJSON, writeJSON } from "./services/adapters/local/storage"
import type { CoffeeRecipe } from "./types"

const KEY = "coffees"

export type SavedCoffee = {
  id: number
  name: string
  image?: string | null
  details?: CoffeeRecipe
  score?: number
  total?: number
  originalTotal?: number
  isFromArena?: boolean
  date?: string
}

export function listSavedCoffees(): SavedCoffee[] {
  return readJSON<SavedCoffee[]>(KEY, [])
}

export function addSavedCoffee(coffee: SavedCoffee): void {
  writeJSON(KEY, [coffee, ...listSavedCoffees()])
}

export function removeSavedCoffee(id: number): void {
  writeJSON(KEY, listSavedCoffees().filter((c) => c.id !== id))
}
