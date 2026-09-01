"use client"

import { useId, useRef, useState, type ReactNode } from "react"
import styles from "./Tabs.module.css"

export type TabItem = { id: string; label: string; content: ReactNode }

export function Tabs({ items, initialId }: { items: TabItem[]; initialId?: string }) {
  const [active, setActive] = useState(initialId ?? items[0]?.id)
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = items.findIndex((t) => t.id === active)
    if (idx === -1) return
    let next = idx
    if (e.key === "ArrowRight") next = (idx + 1) % items.length
    else if (e.key === "ArrowLeft") next = (idx - 1 + items.length) % items.length
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = items.length - 1
    else return
    e.preventDefault()
    const id = items[next].id
    setActive(id)
    tabRefs.current[id]?.focus()
  }

  return (
    <div>
      <div className={styles.tablist} role="tablist" onKeyDown={onKeyDown}>
        {items.map((t) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`${baseId}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={active !== t.id}
          className={styles.panel}
        >
          {active === t.id && t.content}
        </div>
      ))}
    </div>
  )
}
