import { useEffect } from "react"
import { Lock } from "lucide-react"
import ConfigSection from "./ConfigSection"

export default function CoffeeRight({
  started,
  isLocked,
  form,
  handleOptionSelect,
  milkOptions,
  beanOptions,
  foamOptions,
  cupOptions,
  syrupOptions,
  spiceOptions,
  sweetenerOptions,
  techniqueOptions
}: any) {

  useEffect(() => {
    if (!started) return

    const container = document.querySelector(".coffee-right") as HTMLElement
    const sections = document.querySelectorAll(".config-section")

    if (!container) return

    let index = 0
    let animating = false

    const smoothScroll = (targetY: number) => {
      const startY = container.scrollTop
      const distance = targetY - startY
      const duration = 700

      let startTime: number | null = null

      const ease = (t: number) => 1 - Math.pow(1 - t, 4)

      const animate = (time: number) => {
        if (!startTime) startTime = time
        const progress = time - startTime
        const percent = Math.min(progress / duration, 1)

        container.scrollTop = startY + distance * ease(percent)

        if (percent < 1) requestAnimationFrame(animate)
        else animating = false
      }

      requestAnimationFrame(animate)
    }

    const wheelHandler = (e: WheelEvent) => {
      if (animating) return
      animating = true

      if (e.deltaY > 0) index = Math.min(index + 1, sections.length - 1)
      else index = Math.max(index - 1, 0)

      const targetSection = sections[index] as HTMLElement
      if (targetSection) smoothScroll(targetSection.offsetTop)
    }

    container.addEventListener("wheel", wheelHandler)

    return () => container.removeEventListener("wheel", wheelHandler)
  }, [started])

  return (
    <div className="coffee-right">
      {started && (
        <>
          {isLocked && (
            <div className="locked-banner">
              <Lock size={20} />
              <span>🔒 Arena Tarifi - Değiştirilemez</span>
            </div>
          )}

          <ConfigSection title="Süt Tipi" field="milkType" options={milkOptions} selectedValue={form.milkType} isLocked={isLocked} onSelect={handleOptionSelect} />
          <ConfigSection title="Kahve Çekirdeği" field="beanType" options={beanOptions} selectedValue={form.beanType} isLocked={isLocked} onSelect={handleOptionSelect} />
          <ConfigSection title="Süt Köpüğü" field="foam" options={foamOptions} selectedValue={form.foam} isLocked={isLocked} onSelect={handleOptionSelect} />
          <ConfigSection title="Bardak Tipi" field="cupType" options={cupOptions} selectedValue={form.cupType} isLocked={isLocked} onSelect={handleOptionSelect} />
          <ConfigSection title="Şurup" field="syrup" options={syrupOptions} selectedValue={form.syrup} isLocked={isLocked} onSelect={handleOptionSelect} />
          <ConfigSection title="Baharatlar" field="spice" options={spiceOptions} selectedValue={form.spice} isLocked={isLocked} onSelect={handleOptionSelect} />
          <ConfigSection title="Tatlandırıcı" field="sweetener" options={sweetenerOptions} selectedValue={form.sweetener} isLocked={isLocked} onSelect={handleOptionSelect} />
          <ConfigSection title="Özel Teknik" field="technique" options={techniqueOptions} selectedValue={form.technique} isLocked={isLocked} onSelect={handleOptionSelect} />
        </>
      )}
    </div>
  )
}