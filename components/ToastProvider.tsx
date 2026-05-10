"use client"

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"

type ToastType = "success" | "error" | "info" | "warning"

type Toast = {
  id: string
  type: ToastType
  message: string
  durationMs: number
}

type ToastApi = {
  show: (message: string, opts?: { type?: ToastType; durationMs?: number }) => void
  success: (message: string, opts?: { durationMs?: number }) => void
  error: (message: string, opts?: { durationMs?: number }) => void
  info: (message: string, opts?: { durationMs?: number }) => void
  warning: (message: string, opts?: { durationMs?: number }) => void
}

const ToastContext = createContext<ToastApi | null>(null)

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  return (
    <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      <div className="toast-message">{toast.message}</div>
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
    (message: string, opts?: { type?: ToastType; durationMs?: number }) => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`
      const toast: Toast = {
        id,
        type: opts?.type ?? "info",
        message,
        durationMs: opts?.durationMs ?? 3000
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
      success: (message, opts) => show(message, { type: "success", durationMs: opts?.durationMs }),
      error: (message, opts) => show(message, { type: "error", durationMs: opts?.durationMs }),
      info: (message, opts) => show(message, { type: "info", durationMs: opts?.durationMs }),
      warning: (message, opts) => show(message, { type: "warning", durationMs: opts?.durationMs })
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

