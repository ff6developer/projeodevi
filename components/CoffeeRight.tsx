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