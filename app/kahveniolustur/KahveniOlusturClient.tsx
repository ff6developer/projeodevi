"use client"
import { useState } from "react"
import "@/styles/kahveniolustur.css"
import { useRouter } from "next/navigation"
import { Zap, Lock } from "lucide-react"
import CoffeeRight from "@/components/CoffeeRight"
import { useToast } from "@/components/ToastProvider"
import { Button, Card, Input, Progress, Price, IntensityDots } from "@/components/ui"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/components/CartProvider"
import { BASE_COFFEE_KURUS, priceRecipe } from "@/lib/pricing"
import { isLoggedIn } from "@/lib/session"

type RecipeOption = { name: string; price: number; power: number }

const MILK_OPTIONS: RecipeOption[] = [
  { name: "Laktozlu Süt", price: 10, power: 5 }, { name: "Laktozsuz Süt", price: 15, power: 7 },
  { name: "Yulaf Sütü", price: 18, power: 12 }, { name: "Badem Sütü", price: 18, power: 12 },
  { name: "Soya Sütü", price: 15, power: 10 }, { name: "Hindistan Cevizi", price: 20, power: 15 },
  { name: "Proteinli Süt", price: 22, power: 18 }, { name: "Yağsız Süt", price: 8, power: 4 },
  { name: "Süt İstemiyorum", price: 0, power: 2 },
]

const BEAN_OPTIONS: RecipeOption[] = [
  { name: "Brezilya Çekirdeği", price: 20, power: 10 }, { name: "Kolombiya Çekirdeği", price: 25, power: 15 },
  { name: "Etiyopya Çekirdeği", price: 30, power: 25 }, { name: "Guatemala Çekirdeği", price: 35, power: 30 },
]

const FOAM_OPTIONS: RecipeOption[] = [
  { name: "Köpük Var", price: 5, power: 10 }, { name: "Köpük Yok", price: 0, power: 0 },
]

const CUP_OPTIONS: RecipeOption[] = [
  { name: "Karton Bardak", price: 0, power: 0 }, { name: "Cam Bardak", price: 8, power: 10 },
  { name: "Termos Bardak", price: 20, power: 15 }, { name: "Büyük Boy Bardak", price: 12, power: 5 },
]

const SYRUP_OPTIONS: RecipeOption[] = [
  { name: "Vanilya Şurubu", price: 15, power: 10 }, { name: "Karamel Şurubu", price: 18, power: 12 },
  { name: "Fındık Şurubu", price: 18, power: 12 }, { name: "Çikolata Şurubu", price: 20, power: 15 },
  { name: "Şurup İstemiyorum", price: 0, power: 0 },
]

const SPICE_OPTIONS: RecipeOption[] = [
  { name: "Tarçın", price: 6, power: 5 }, { name: "Kakao Tozu", price: 7, power: 5 },
  { name: "Hindistan Cevizi", price: 10, power: 10 }, { name: "Muskat", price: 8, power: 12 },
  { name: "Baharat İstemiyorum", price: 0, power: 0 },
]

const SWEETENER_OPTIONS: RecipeOption[] = [
  { name: "Beyaz Şeker", price: 4, power: 2 }, { name: "Esmer Şeker", price: 6, power: 5 },
  { name: "Bal", price: 12, power: 15 }, { name: "Stevia", price: 10, power: 10 },
  { name: "Tatlandırıcı İstemiyorum", price: 0, power: 0 },
]

const TECHNIQUE_OPTIONS: RecipeOption[] = [
  { name: "Extra Shot", price: 22, power: 25 }, { name: "Daha Sıcak Servis", price: 3, power: 2 },
  { name: "Ilık Servis", price: 0, power: 0 }, { name: "Buzlu Servis", price: 8, power: 10 },
  { name: "Latte Art", price: 15, power: 30 }, { name: "Değişiklik Yok", price: 0, power: 0 },
]

// Kullanıcı hiçbir şeye dokunmadan geçerli bir başlangıç reçetesi görsün diye
// her alanın mantıklı bir varsayılanı var (opt-out'lar seçili gelir).
const DEFAULT_FORM = {
  milkType: MILK_OPTIONS[0],       // Laktozlu Süt
  beanType: BEAN_OPTIONS[0],       // Brezilya Çekirdeği
  foam: FOAM_OPTIONS[1],           // Köpük Yok
  cupType: CUP_OPTIONS[0],         // Karton Bardak
  syrup: SYRUP_OPTIONS[4],         // Şurup İstemiyorum
  spice: SPICE_OPTIONS[4],         // Baharat İstemiyorum
  sweetener: SWEETENER_OPTIONS[4], // Tatlandırıcı İstemiyorum
  technique: TECHNIQUE_OPTIONS[5], // Değişiklik Yok
}

/** Arena "tarifi kopyala" ile bırakılan taslağı bir kez okur (ve temizler). */
function readCopiedRecipe(): Record<string, RecipeOption | string | boolean> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem("copiedRecipe")
    if (!raw) return null
    window.localStorage.removeItem("copiedRecipe")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default function KahveniOlusturClient() {
  const router = useRouter()
  const toast = useToast()
  const { addRecipe } = useCart()

  const [customCoffeeName, setCustomCoffeeName] = useState("")

  // Arena taslağı (varsa) — render sırasında bir kez, effect'siz.
  const [copied] = useState(readCopiedRecipe)
  const fromArena =
    !!copied && copied.fromArena === true && copied.locked === true

  const [isLocked] = useState(fromArena)
  const [arenaCoffeeName] = useState(() =>
    fromArena && typeof copied?.name === "string" ? copied.name : "",
  )
  const [arenaCoffeeImage] = useState<string | null>(() =>
    fromArena && typeof copied?.image === "string" ? copied.image : null,
  )

  const [form, setForm] = useState(() => {
    if (!copied) return { ...DEFAULT_FORM }
    const pick = (k: keyof typeof DEFAULT_FORM) =>
      (copied[k] as RecipeOption) || DEFAULT_FORM[k]
    return {
      milkType: pick("milkType"),
      beanType: pick("beanType"),
      foam: pick("foam"),
      cupType: pick("cupType"),
      syrup: pick("syrup"),
      spice: pick("spice"),
      sweetener: pick("sweetener"),
      technique: pick("technique"),
    }
  })

  // Seçim adımları — ilerleme göstergesi ve eksik-adım listesi için tek kaynak.
  const SELECTION_STEPS: { field: keyof typeof form; label: string }[] = [
    { field: "milkType", label: "Süt Tipi" },
    { field: "beanType", label: "Kahve Çekirdeği" },
    { field: "foam", label: "Süt Köpüğü" },
    { field: "cupType", label: "Bardak Tipi" },
    { field: "syrup", label: "Şurup" },
    { field: "spice", label: "Baharatlar" },
    { field: "sweetener", label: "Tatlandırıcı" },
    { field: "technique", label: "Özel Teknik" },
  ]

  const selectedCount = SELECTION_STEPS.filter((s) => form[s.field]).length
  const missingSteps = SELECTION_STEPS.filter((s) => !form[s.field])
  const allSelected = missingSteps.length === 0

  const creativityScore =
    (form.milkType?.power || 0) + (form.beanType?.power || 0) + 
    (form.syrup?.power || 0) + (form.technique?.power || 0) + 
    (form.spice?.power || 0);

  // Fiyat: tek kaynak lib/pricing.priceRecipe (temel kahve + ücretli eklentiler,
  // Arena kilidi varsa eklentilere %15 indirim). Tutarlar kuruş.
  const { subtotalKurus, discountKurus, totalKurus } = priceRecipe(form, {
    arenaLocked: isLocked,
  })

  // Fiyat dökümü satırları — sadece ücretli eklentiler gösterilir
  const priceRows = SELECTION_STEPS
    .map((s) => ({ label: s.label, price: (form[s.field]?.price as number) || 0, name: form[s.field]?.name as string }))
    .filter((r) => r.price > 0)

  // Kilitli tarifte seçim değiştirilemez.
  const handleOptionSelect = (field: string, item: RecipeOption) => {
    if (isLocked) return
    setForm({ ...form, [field]: item })
  }

  const handleAddToCart = () => {
    if (!allSelected) return
    if (!isLoggedIn()) {
      toast.warning("Sepete eklemek için önce giriş yap.")
      router.push("/giris?next=/kahveniolustur")
      return
    }

    // Kahve ismi: kullanıcı girdiyse onu, arena'dan geldiyse onu, yoksa İsimsiz
    const finalCoffeeName = customCoffeeName.trim() || arenaCoffeeName || "İsimsiz Kahve"

    // Tasarlanan tarif → sepet satırı (sipariş, ödeme akışında oluşturulur)
    addRecipe({
      name: finalCoffeeName,
      image: arenaCoffeeImage,
      unitKurus: totalKurus,
      recipe: form,
      score: creativityScore,
      fromArena: isLocked,
    })

    // "Kahvelerim" galerisi (profil sekmesi) — tasarım kaydı
    const coffeeData = {
      id: Date.now(),
      name: finalCoffeeName,
      image: arenaCoffeeImage,
      details: form,
      score: creativityScore,
      total: Math.round(totalKurus / 100),
      originalTotal: Math.round(subtotalKurus / 100),
      isFromArena: isLocked,
      date: new Date().toISOString(),
    }
    const existingCoffees = JSON.parse(localStorage.getItem("coffees") || "[]")
    localStorage.setItem("coffees", JSON.stringify([coffeeData, ...existingCoffees]))

    toast.success(
      isLocked
        ? "Kahven sepete eklendi — %15 topluluk indirimi uygulandı."
        : "Kahven sepete eklendi.",
    )

    setCustomCoffeeName("")
    router.push("/sepet")
  }

  

  return (
    <div className="coffee-layout">
      <aside className="coffee-summary">
        <Card pad="md" elevated>
          <p className="eyebrow">Kahve tasarımı</p>
          <h1 className="coffee-summary-title">Kendi kahveni tasarla</h1>
          <p className="coffee-summary-lede">
            Her seçim tarifini ve fiyatını anında güncelliyor.
          </p>

          <div className="coffee-summary-metrics">
            <div>
              <span className="coffee-metric-label">
                <Zap size={13} aria-hidden="true" /> Yaratıcılık puanı
              </span>
              <span className="coffee-metric-value">{creativityScore}</span>
            </div>
            <IntensityDots value={Math.min(5, Math.max(1, Math.round(creativityScore / 20))) as 1 | 2 | 3 | 4 | 5} />
          </div>

          <div className="coffee-price">
            <div className="coffee-price-row">
              <span>Temel kahve</span>
              <span>{formatPrice(BASE_COFFEE_KURUS)}</span>
            </div>
            {priceRows.map((r) => (
              <div className="coffee-price-row" key={r.label}>
                <span>
                  {r.label}
                  <span className="coffee-price-opt"> · {r.name}</span>
                </span>
                <span>+ {formatPrice(r.price * 100)}</span>
              </div>
            ))}
            {isLocked && discountKurus > 0 && (
              <div className="coffee-price-row coffee-price-discount">
                <span>Topluluk indirimi (%15)</span>
                <span>− {formatPrice(discountKurus)}</span>
              </div>
            )}
            <div className="coffee-price-row coffee-price-total">
              <span>Toplam</span>
              <Price
                value={totalKurus}
                original={isLocked && discountKurus > 0 ? subtotalKurus : undefined}
              />
            </div>
          </div>

          {!isLocked && (
            <Input
              label="Kahvenin adı (opsiyonel)"
              placeholder="Kahvene bir isim ver…"
              value={customCoffeeName}
              onChange={(e) => setCustomCoffeeName(e.target.value)}
              maxLength={30}
              hint={`${customCoffeeName.length}/30`}
            />
          )}

          {isLocked && arenaCoffeeName && (
            <p className="coffee-locked-name">
              <Lock size={14} aria-hidden="true" /> {arenaCoffeeName}
            </p>
          )}

          {isLocked && (
            <p className="coffee-locked-note">
              Bu tarif toplumdan geldiği için içeriği değiştirilemez.
            </p>
          )}

          <div className="coffee-cta">
            <Progress
              value={selectedCount}
              max={SELECTION_STEPS.length}
              label={`${selectedCount} / ${SELECTION_STEPS.length} seçim tamamlandı`}
            />
            {missingSteps.length > 0 && (
              <p className="coffee-missing">
                Kalan:{" "}
                {missingSteps.map((s, i) => (
                  <span key={s.field}>
                    <a href={`#section-${s.field}`}>{s.label}</a>
                    {i < missingSteps.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
            <Button block size="lg" onClick={handleAddToCart} disabled={!allSelected}>
              Sepete ekle
              {isLocked && allSelected ? " (%15 indirim)" : ""}
            </Button>
          </div>
        </Card>
      </aside>

      <CoffeeRight
  isLocked={isLocked}
  form={form}
  handleOptionSelect={handleOptionSelect}
  milkOptions={MILK_OPTIONS}
  beanOptions={BEAN_OPTIONS}
  foamOptions={FOAM_OPTIONS}
  cupOptions={CUP_OPTIONS}
  syrupOptions={SYRUP_OPTIONS}
  spiceOptions={SPICE_OPTIONS}
  sweetenerOptions={SWEETENER_OPTIONS}
  techniqueOptions={TECHNIQUE_OPTIONS}
/>

    </div>
  )
}