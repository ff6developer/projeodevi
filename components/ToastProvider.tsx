"use client"

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import Link from "next/link"

type ToastType = "success" | "error" | "info" | "warning"

type ToastAction = { label: string; href: string }

type ToastOpts = { type?: ToastType; durationMs?: number; action?: ToastAction }

type Toast = {
  id: string
  type: ToastType
  message: string
  durationMs: number
  action?: ToastAction
}

type ToastApi = {
  show: (message: string, opts?: ToastOpts) => void
  success: (message: string, opts?: Omit<ToastOpts, "type">) => void
  error: (message: string, opts?: Omit<ToastOpts, "type">) => void
  info: (message: string, opts?: Omit<ToastOpts, "type">) => void
  warning: (message: string, opts?: Omit<ToastOpts, "type">) => void
}

const ToastContext = createContext<ToastApi | null>(null)

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  return (
    <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      <div className="toast-body">
        <div className="toast-message">{toast.message}</div>
        {toast.action && (
          <Link href={toast.action.href} className="toast-action" onClick={() => onClose(toast.id)}>
            {toast.action.label}
          </Link>
        )}
      </div>
      <button className="toast-close" onClick={() => onClose(toast.id)} aria-label="Kapat">
        ×
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Record<string, number>>({})

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timersRef.current[id]
    if (timer) {
      window.clearTimeout(timer)
      delete timersRef.current[id]
    }
  }, [])

  const show = useCallback(
    (message: string, opts?: ToastOpts) => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`
      const toast: Toast = {
        id,
        type: opts?.type ?? "info",
        message,
        durationMs: opts?.durationMs ?? (opts?.action ? 5000 : 3000),
        action: opts?.action,
      }

      setToasts(prev => [toast, ...prev].slice(0, 4))

      timersRef.current[id] = window.setTimeout(() => {
        remove(id)
      }, toast.durationMs)
    },
    [remove]
  )

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message, opts) => show(message, { ...opts, type: "success" }),
      error: (message, opts) => show(message, { ...opts, type: "error" }),
      info: (message, opts) => show(message, { ...opts, type: "info" }),
      warning: (message, opts) => show(message, { ...opts, type: "warning" }),
    }),
    [show]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-viewport" aria-label="Bildirimler">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
