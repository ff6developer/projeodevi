"use client"
import { useState, useEffect } from "react"
import "@/styles/kahveniolustur.css"
import { useRouter } from "next/navigation"
import { Beaker, Zap, Trophy, Lock, Unlock } from "lucide-react"
import CoffeeRight from "@/components/CoffeeRight"
import { useToast } from "@/components/ToastProvider"
import { createOrder } from "@/lib/orders"

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

export default function KahveniOlusturClient() {
  const [arenaCoffeeName, setArenaCoffeeName] = useState("")
  const [arenaCoffeeImage, setArenaCoffeeImage] = useState<string | null>(null)
  const [customCoffeeName, setCustomCoffeeName] = useState("")
  const router = useRouter()
  const toast = useToast()

  // Arena'dan gelen kilitli tarif durumu
  const [isLocked, setIsLocked] = useState(false)

  const [form, setForm] = useState({ ...DEFAULT_FORM })

  useEffect(() => {
    const copied = localStorage.getItem("copiedRecipe")
    if (copied) {
      const parsed = JSON.parse(copied)

      // Arena'dan gelen tarif — eksik alan varsa varsayılanla tamamla.
      setForm({
        milkType: parsed.milkType || DEFAULT_FORM.milkType,
        beanType: parsed.beanType || DEFAULT_FORM.beanType,
        foam: parsed.foam || DEFAULT_FORM.foam,
        cupType: parsed.cupType || DEFAULT_FORM.cupType,
        syrup: parsed.syrup || DEFAULT_FORM.syrup,
        spice: parsed.spice || DEFAULT_FORM.spice,
        sweetener: parsed.sweetener || DEFAULT_FORM.sweetener,
        technique: parsed.technique || DEFAULT_FORM.technique,
      })

      // 🔒 ARENA KONTROLÜ: Eğer arena'dan geliyorsa kilitle
      if (parsed.fromArena === true && parsed.locked === true) {
        setIsLocked(true)
        if (parsed.name) setArenaCoffeeName(parsed.name)
        if (parsed.image) setArenaCoffeeImage(parsed.image)
      }

      localStorage.removeItem("copiedRecipe")
    }
  }, [])

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

  // Fiyat: temel kahve + seçilen eklentiler (varsa Arena indirimi eklentilere uygulanır)
  const subtotal =
    (form.milkType?.price || 0) + (form.beanType?.price || 0) +
    (form.foam?.price || 0) + (form.cupType?.price || 0) +
    (form.syrup?.price || 0) + (form.spice?.price || 0) +
    (form.sweetener?.price || 0) + (form.technique?.price || 0)

  const basePrice = 100
  const discountAmount = isLocked ? Math.round(subtotal * 0.15) : 0
  const total = basePrice + subtotal - discountAmount
  const originalTotal = basePrice + subtotal

  // Geçici para birimi biçimlendirici (TASK-074'te lib/format'a taşınacak)
  const fmtTRY = (n: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n)

  // Fiyat dökümü satırları — sadece ücretli eklentiler gösterilir
  const priceRows = SELECTION_STEPS
    .map((s) => ({ label: s.label, price: (form[s.field]?.price as number) || 0, name: form[s.field]?.name as string }))
    .filter((r) => r.price > 0)

  // 🔒 YENİ: Kilit kontrollü seçim
  const handleOptionSelect = (field: string, item: any) => {
    if (isLocked) return
    setForm({ ...form, [field]: item })
  }

  const handleSiparis = () => {
    if (!allSelected) return;
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      toast.warning("Sipariş vermek için önce giriş yapmalısın!")
      router.push("/giris");
      return;
    }

    // Kahve ismi: kullanıcı girdiyse onu, arena'dan geldiyse onu, yoksa İsimsiz
    const finalCoffeeName = customCoffeeName.trim() || arenaCoffeeName || "İsimsiz Kahve"

    // Kanonik sipariş kaydı (lib/orders → elmenes.orders)
    const order = createOrder({
      items: [
        {
          kind: "recipe",
          name: finalCoffeeName,
          image: arenaCoffeeImage,
          unitKurus: Math.round(total * 100),
          qty: 1,
          recipe: form,
          score: creativityScore,
          fromArena: isLocked,
        },
      ],
      subtotalKurus: Math.round(originalTotal * 100),
      discountKurus: Math.round(discountAmount * 100),
      shippingKurus: 0,
      totalKurus: Math.round(total * 100),
    })

    // Geçiş dönemi: Admin paneli hâlâ eski "orders" anahtarını okuyor (TASK-122'de
    // lib/orders'a taşınacak). O güne kadar eski formatta bir kopya da yazılır.
    const legacyOrder = {
      id: order.id,
      coffeeName: finalCoffeeName,
      details: form,
      totalPrice: total,
      originalPrice: originalTotal,
      discountApplied: isLocked ? 15 : 0,
      isFromArena: isLocked,
      score: creativityScore,
      status: "Bekliyor",
      date: new Date().toLocaleString("tr-TR"),
    }
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([...existingOrders, legacyOrder]))

    const coffeeData = {
      id: Date.now(),
      name: finalCoffeeName,
      image: arenaCoffeeImage,
      details: form,
      score: creativityScore,
      total: total,
      originalTotal: originalTotal,
      isFromArena: isLocked,
      date: new Date().toISOString()
    }

    const existingCoffees = JSON.parse(localStorage.getItem("coffees") || "[]");
    localStorage.setItem("coffees", JSON.stringify([coffeeData, ...existingCoffees]));

    toast.success(isLocked ? "Siparişin alındı — %15 Arena indirimi uygulandı." : "Siparişin alındı.")

    setCustomCoffeeName("")
    router.push(`/siparis?o=${order.id}`)
  }

  

  return (
    <div className="coffee-layout">
      <div className="coffee-bg"></div>
      <div className="coffee-left">
        <div className="lab-badge"><Beaker size={16} /> THE COFFEE LAB</div>
        <h1 className="hero-title">Şampiyonu Tasarla.</h1>
        <p className="hero-sub">
          Arenada yarışacak kahveni tasarlıyorsun. Her seçim yaratıcılık puanını artırır!
        </p>

        <div className="arena-stats-container">
          <div className="arena-stat-box">
            <span className="stat-label"><Zap size={14} color="#ffd59e"/> Yaratıcılık Puanı</span>
            <span className="stat-value">{creativityScore}</span>
            <span className="stat-hint">Seçimlerinin özgünlüğü — Toplulukta öne çıkmana yardımcı olur.</span>
          </div>
        </div>

        <div className="builder-price">
              <div className="builder-price-row">
                <span>Temel kahve</span>
                <span>{fmtTRY(basePrice)}</span>
              </div>
              {priceRows.map((r) => (
                <div className="builder-price-row" key={r.label}>
                  <span>{r.label}<span className="builder-price-opt"> · {r.name}</span></span>
                  <span>+ {fmtTRY(r.price)}</span>
                </div>
              ))}
              {isLocked && discountAmount > 0 && (
                <div className="builder-price-row builder-price-discount">
                  <span><Unlock size={13} /> Arena indirimi (%15)</span>
                  <span>− {fmtTRY(discountAmount)}</span>
                </div>
              )}
              <div className="builder-price-row builder-price-total">
                <span>Toplam</span>
                <span>
                  {fmtTRY(total)}
                  {isLocked && discountAmount > 0 && (
                    <span className="builder-price-was">{fmtTRY(originalTotal)}</span>
                  )}
                </span>
              </div>
            </div>

        {/* KAHVE İSMİ */}
        {!isLocked && (
          <div className="coffee-name-input-wrapper">
            <label className="coffee-name-label">
              <Beaker size={14} /> Kahvenin Adı
            </label>
            <input
              type="text"
              className="coffee-name-input"
              placeholder="Kahvene bir isim ver (opsiyonel)..."
              value={customCoffeeName}
              onChange={(e) => setCustomCoffeeName(e.target.value)}
              maxLength={30}
            />
            <span className="coffee-name-hint">
              {customCoffeeName.length}/30 karakter
            </span>
          </div>
        )}

        {isLocked && arenaCoffeeName && (
          <div className="coffee-name-input-wrapper locked-name">
            <label className="coffee-name-label">
              <Beaker size={14} /> Arena Kahvesi
            </label>
            <div className="locked-coffee-name">{arenaCoffeeName}</div>
          </div>
        )}

        {isLocked && (
          <div className="locked-warning">
            <Lock size={16} />
            <span>Bu tarif Arenadan geldiği için içeriği değiştiremezsiniz.</span>
          </div>
        )}

        <div className="builder-cta">
            <div className="builder-progress">
              <span className="builder-progress-count">{selectedCount} / {SELECTION_STEPS.length} seçim tamamlandı</span>
              <span className="builder-progress-track" aria-hidden="true">
                <span
                  className="builder-progress-fill"
                  style={{ width: `${(selectedCount / SELECTION_STEPS.length) * 100}%` }}
                />
              </span>
            </div>

            {missingSteps.length > 0 && (
              <p className="builder-missing">
                Kalan:{" "}
                {missingSteps.map((s, i) => (
                  <span key={s.field}>
                    <a href={`#section-${s.field}`}>{s.label}</a>
                    {i < missingSteps.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}

            <button
              className="arena-btn"
              onClick={handleSiparis}
              disabled={!allSelected}
            >
              <Trophy size={18} /> Siparişi Tamamla
              {isLocked && allSelected && (
                <span style={{ marginLeft: "8px", fontSize: "0.8em" }}>(%15 İndirim)</span>
              )}
            </button>
        </div>
      </div>
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