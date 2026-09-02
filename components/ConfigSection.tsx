"use client"

import { useRef } from "react"
import { Lock } from "lucide-react"
import { formatPrice } from "@/lib/format"

interface OptionItem {
  name: string
  price: number
  power: number
}

interface Props {
  title: string
  field: string
  options: OptionItem[]
  selectedValue: OptionItem | null
  isLocked: boolean
  onSelect: (field: string, item: OptionItem) => void
}

export default function ConfigSection({
  title,
  field,
  options,
  selectedValue,
  isLocked,
  onSelect,
}: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (from: number, dir: 1 | -1) => {
    if (isLocked) return
    const next = (from + dir + options.length) % options.length
    refs.current[next]?.focus()
    onSelect(field, options[next])
  }

  return (
    <section className="config-section" id={`section-${field}`} aria-labelledby={`label-${field}`}>
      <h3 className="section-title" id={`label-${field}`}>
        {title}
      </h3>

      <div
        className="option-group"
        role="radiogroup"
        aria-labelledby={`label-${field}`}
        aria-disabled={isLocked || undefined}
      >
        {options.map((item, i) => {
          const active = selectedValue?.name === item.name
          return (
            <button
              key={item.name}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active || (!selectedValue && i === 0) ? 0 : -1}
              disabled={isLocked}
              className={`option-item${active ? " is-active" : ""}${isLocked ? " is-locked" : ""}`}
              onClick={() => onSelect(field, item)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                  e.preventDefault()
                  move(i, 1)
                } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                  e.preventDefault()
                  move(i, -1)
                }
              }}
            >
              <span className="option-name">
                {item.name}
                {isLocked && active && <Lock size={13} aria-hidden="true" />}
              </span>
              {item.price > 0 && (
                <span className="option-price">+ {formatPrice(item.price * 100)}</span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
