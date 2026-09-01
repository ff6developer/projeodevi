"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Modal } from "../Modal/Modal"
import { Button } from "../Button/Button"

type ConfirmOptions = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  tone?: "default" | "danger"
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmOptions | null>(null)
  const resolverRef = useRef<((v: boolean) => void) | null>(null)

  const confirm = useCallback<ConfirmFn>((opts) => {
    setState(opts)
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const settle = useCallback((value: boolean) => {
    resolverRef.current?.(value)
    resolverRef.current = null
    setState(null)
  }, [])

  const value = useMemo(() => confirm, [confirm])

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Modal
        open={state !== null}
        onClose={() => settle(false)}
        title={state?.title ?? ""}
        actions={
          <>
            <Button variant="secondary" onClick={() => settle(false)}>
              {state?.cancelText ?? "Vazgeç"}
            </Button>
            <Button
              variant={state?.tone === "danger" ? "danger" : "primary"}
              onClick={() => settle(true)}
            >
              {state?.confirmText ?? "Onayla"}
            </Button>
          </>
        }
      >
        {state?.description && <p style={{ color: "var(--ink-2)" }}>{state.description}</p>}
      </Modal>
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider")
  return ctx
}
