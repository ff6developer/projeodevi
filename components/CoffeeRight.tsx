import { Lock } from "lucide-react"
import ConfigSection from "./ConfigSection"
import type { RecipeOption } from "@/lib/types"

type BuilderForm = Record<string, RecipeOption>

type CoffeeRightProps = {
  isLocked: boolean
  form: BuilderForm
  handleOptionSelect: (field: string, item: RecipeOption) => void
  milkOptions: RecipeOption[]
  beanOptions: RecipeOption[]
  foamOptions: RecipeOption[]
  cupOptions: RecipeOption[]
  syrupOptions: RecipeOption[]
  spiceOptions: RecipeOption[]
  sweetenerOptions: RecipeOption[]
  techniqueOptions: RecipeOption[]
}

export default function CoffeeRight({
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
  techniqueOptions,
}: CoffeeRightProps) {

  return (
    <div className="coffee-right">
      {isLocked && (
        <div className="locked-banner">
          <Lock size={20} />
          <span>Topluluk tarifi — değiştirilemez</span>
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
    </div>
  )
}
