// AuthService — LOCAL adapter (tarayıcı depolaması, gerçek backend yok).
//
// Kayıtlı kullanıcılar `elmenes.users` altında SADECE {name,email} olarak tutulur
// — parola hiçbir zaman saklanmaz (düz metin parola saklamak kötü pratik; bu bir
// demo). Login, e-postanın kayıtlı olup olmadığına bakar. Portföy kolaylığı için
// hazır bir demo hesabı da vardır.

import type {
  AuthService,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "../../auth"
import { err, ok, sleep, MOCK_LATENCY_MS, type Result } from "../../types"
import { readJSON, writeJSON } from "./storage"
import { getUser, setUser, clearSession } from "@/lib/session"

const USERS_KEY = "elmenes.users"

const DEMO_USER: AuthUser = { name: "Demo Kullanıcı", email: "demo@elmenes.coffee" }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function listUsers(): AuthUser[] {
  return readJSON<AuthUser[]>(USERS_KEY, [])
}

function saveUsers(users: AuthUser[]): void {
  writeJSON(USERS_KEY, users)
}

function findByEmail(email: string): AuthUser | undefined {
  const e = email.trim().toLowerCase()
  return listUsers().find((u) => u.email.toLowerCase() === e)
}

async function register(input: RegisterInput): Promise<Result<AuthUser>> {
  await sleep(MOCK_LATENCY_MS)

  const name = input.name.trim()
  const email = input.email.trim()

  if (name.length < 2) return err("Adını gir (en az 2 karakter).", "name")
  if (!EMAIL_RE.test(email)) return err("Geçerli bir e-posta gir.", "email")
  if (input.password.length < 8) return err("Şifre en az 8 karakter olmalı.", "password")
  if (findByEmail(email)) return err("Bu e-posta zaten kayıtlı. Giriş yapmayı dene.", "email")

  const user: AuthUser = { name, email }
  saveUsers([...listUsers(), user])
  setUser(user) // kayıt sonrası otomatik oturum
  return ok(user)
}

async function login(input: LoginInput): Promise<Result<AuthUser>> {
  await sleep(MOCK_LATENCY_MS)

  const email = input.email.trim()
  if (!EMAIL_RE.test(email)) return err("Geçerli bir e-posta gir.", "email")
  if (!input.password) return err("Şifreni gir.", "password")

  const known = findByEmail(email) ?? (email.toLowerCase() === DEMO_USER.email ? DEMO_USER : undefined)
  if (!known) {
    return err("Bu e-posta ile kayıt bulunamadı. Önce kayıt ol.", "email")
  }

  setUser(known)
  return ok(known)
}

async function loginDemo(): Promise<Result<AuthUser>> {
  await sleep(MOCK_LATENCY_MS)
  if (!findByEmail(DEMO_USER.email)) {
    saveUsers([...listUsers(), DEMO_USER])
  }
  setUser(DEMO_USER)
  return ok(DEMO_USER)
}

async function logout(): Promise<void> {
  clearSession()
}

function getCurrentUser(): AuthUser | null {
  return getUser()
}

export const localAuthService: AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  loginDemo,
}
