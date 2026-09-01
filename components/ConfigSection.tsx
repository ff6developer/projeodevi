import { Lock } from "lucide-react"

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
  onSelect
}: Props) {
  return (
    <section className="config-section" id={`section-${field}`}>
      <h2 className="section-title">
        {title} <span className="required-star">*</span>
      </h2>
      <span className="required-text">(Bu kısım zorunludur)</span>

      <div className="option-group">
        {options.map(item => (
          <div
            key={item.name}
            onClick={() => onSelect(field, item)}
            className={`milk-item ${
              selectedValue?.name === item.name ? "active" : ""
            } ${isLocked ? "locked" : ""}`}
          >
            <span>{item.name}</span>

            {isLocked && selectedValue?.name === item.name && (
              <Lock size={14} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}