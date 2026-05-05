"use client"
import { useState, useEffect } from "react"
import "../../styles/kahveniolustur.css"
import { useRouter } from "next/navigation"
import { Beaker, Zap, Trophy, Lock, Unlock } from "lucide-react"
import CoffeeRight from "../../components/CoffeeRight"
import { useToast } from "../../components/ToastProvider"

export default function KahveniOlustur() {
  const [arenaCoffeeName, setArenaCoffeeName] = useState("")
  const [arenaCoffeeImage, setArenaCoffeeImage] = useState<string | null>(null)
  const [customCoffeeName, setCustomCoffeeName] = useState("")
  const router = useRouter()
  const toast = useToast()
  const [started, setStarted] = useState(false)

  // 🔒 YENİ: Kilit ve indirim state'leri
  const [isLocked, setIsLocked] = useState(false)

  const [form, setForm] = useState({
    milkType: null as any,
    beanType: null as any,
    foam: null as any,
    cupType: null as any,
    syrup: null as any,
    spice: null as any,
    sweetener: null as any,
    technique: null as any
  })

  useEffect(() => {
    const copied = localStorage.getItem("copiedRecipe")
    if (copied) {
      const parsed = JSON.parse(copied)
      
      // Form verilerini yükle
      setForm({
        milkType: parsed.milkType || null,
        beanType: parsed.beanType || null,
        foam: parsed.foam || null,
        cupType: parsed.cupType || null,
        syrup: parsed.syrup || null,
        spice: parsed.spice || null,
        sweetener: parsed.sweetener || null,
        technique: parsed.technique || null
      })

      // 🔒 ARENA KONTROLÜ: Eğer arena'dan geliyorsa kilitle
      if (parsed.fromArena === true && parsed.locked === true) {
        setIsLocked(true)
        if (parsed.name) setArenaCoffeeName(parsed.name)
        if (parsed.image) setArenaCoffeeImage(parsed.image)
      }

      setStarted(true)
      localStorage.removeItem("copiedRecipe")
    }
  }, [])

  const allSelected =
    form.milkType && form.beanType && form.foam && form.cupType && 
    form.syrup && form.spice && form.sweetener && form.technique

  const milkOptions = [
    { name: "Laktozlu Süt", price: 10, power: 5 }, { name: "Laktozsuz Süt", price: 15, power: 7 },
    { name: "Yulaf Sütü", price: 18, power: 12 }, { name: "Badem Sütü", price: 18, power: 12 },
    { name: "Soya Sütü", price: 15, power: 10 }, { name: "Hindistan Cevizi", price: 20, power: 15 },
    { name: "Proteinli Süt", price: 22, power: 18 }, { name: "Yağsız Süt", price: 8, power: 4 },
    { name: "Süt İstemiyorum", price: 0, power: 2 }
  ]

  const beanOptions = [
    { name: "Brezilya Çekirdeği", price: 20, power: 10 }, { name: "Kolombiya Çekirdeği", price: 25, power: 15 },
    { name: "Etiyopya Çekirdeği", price: 30, power: 25 }, { name: "Guatemala Çekirdeği", price: 35, power: 30 }
  ]

  const foamOptions = [{ name: "Köpük Var", price: 5, power: 10 }, { name: "Köpük Yok", price: 0, power: 0 }]
  
  const cupOptions = [
    { name: "Karton Bardak", price: 0, power: 0 }, { name: "Cam Bardak", price: 8, power: 10 },
    { name: "Termos Bardak", price: 20, power: 15 }, { name: "Büyük Boy Bardak", price: 12, power: 5 }
  ]

  const syrupOptions = [
    { name: "Vanilya Şurubu", price: 15, power: 10 }, { name: "Karamel Şurubu", price: 18, power: 12 },
    { name: "Fındık Şurubu", price: 18, power: 12 }, { name: "Çikolata Şurubu", price: 20, power: 15 },
    { name: "Şurup İstemiyorum", price: 0, power: 0 }
  ]

  const spiceOptions = [
    { name: "Tarçın", price: 6, power: 5 }, { name: "Kakao Tozu", price: 7, power: 5 },
    { name: "Hindistan Cevizi", price: 10, power: 10 }, { name: "Muskat", price: 8, power: 12 },
    { name: "Baharat İstemiyorum", price: 0, power: 0 }
  ]

  const sweetenerOptions = [
    { name: "Beyaz Şeker", price: 4, power: 2 }, { name: "Esmer Şeker", price: 6, power: 5 },
    { name: "Bal", price: 12, power: 15 }, { name: "Stevia", price: 10, power: 10 },
    { name: "Tatlandırıcı İstemiyorum", price: 0, power: 0 }
  ]

  const techniqueOptions = [
    { name: "Extra Shot", price: 22, power: 25 }, { name: "Daha Sıcak Servis", price: 3, power: 2 },
    { name: "Ilık Servis", price: 0, power: 0 }, { name: "Buzlu Servis", price: 8, power: 10 },
    { name: "Latte Art", price: 15, power: 30 }, { name: "Değişiklik Yok", price: 0, power: 0 }
  ]

  const creativityScore = 
    (form.milkType?.power || 0) + (form.beanType?.power || 0) + 
    (form.syrup?.power || 0) + (form.technique?.power || 0) + 
    (form.spice?.power || 0);

  // 🔒 YENİ: İndirimli fiyat hesaplama
  const subtotal = 
    (form.milkType?.price || 0) + (form.beanType?.price || 0) + 
    (form.foam?.price || 0) + (form.cupType?.price || 0) + 
    (form.syrup?.price || 0) + (form.spice?.price || 0) + 
    (form.sweetener?.price || 0) + (form.technique?.price || 0)

  const basePrice = 100
  const discountAmount = isLocked ? Math.round(subtotal * 0.15) : 0
  const total = basePrice + subtotal - discountAmount
  const originalTotal = basePrice + subtotal

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

    // ☕ KAHVE İSMİ: Kullanıcı girdiyse onu, arena'dan geldiyse onu, yoksa İsimsiz
    const finalCoffeeName = customCoffeeName.trim() || arenaCoffeeName || "İsimsiz Kahve"

    const orderData = {
      id: Date.now(),
      coffeeName: finalCoffeeName,
      details: form,
      totalPrice: total,
      originalPrice: originalTotal,
      discountApplied: isLocked ? 15 : 0,
      isFromArena: isLocked,
      score: creativityScore,
      status: "Hazırlanıyor",
      date: new Date().toLocaleString('tr-TR')
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existingOrders, orderData]));

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

    toast.success(isLocked ? "Siparişin alındı! %15 Arena İndirimi uygulandı" : "Siparişin alındı!")
    
    // Input'u temizle
    setCustomCoffeeName("")
    
    router.push("./siparis");
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

        {started && (
          <>
            <div className="arena-stats-container">
              <div className="arena-stat-box">
                <span className="stat-label"><Zap size={14} color="#ffd59e"/> Yaratıcılık Puanı</span>
                <span className="stat-value">{creativityScore}</span>
              </div>
              <div className="arena-stat-box">
                <span className="stat-label">Toplam Fiyat</span>
                <span className="stat-value">
                  {total} TL
                  {isLocked && (
                    <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.8em', marginLeft: '8px' }}>
                      {originalTotal} TL
                    </span>
                  )}
                </span>
              </div>
              {isLocked && (
                <div className="arena-stat-box discount-box">
                  <span className="stat-label"><Unlock size={14} color="#4ade80"/> Arena İndirimi</span>
                  <span className="stat-value" style={{ color: '#4ade80' }}>-%15</span>
                </div>
              )}
            </div>

            {/* ☕ KAHVE İSMİ INPUT'U - EN ALTA TAŞINDI */}
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
          </>
        )}

        {isLocked && (
          <div className="locked-warning">
            <Lock size={16} />
            <span>Bu tarif Arenadan geldiği için içeriği değiştiremezsiniz.</span>
          </div>
        )}

        {!started ? (
          <button className="hero-btn" onClick={() => setStarted(true)}>Laboratuvarı Aç</button>
        ) : (
          allSelected && (
            <button className="arena-btn" onClick={handleSiparis} style={{width: 'fit-content'}}>
              <Trophy size={18} /> Siparişi Tamamla
              {isLocked && <span style={{marginLeft: '8px', fontSize: '0.8em'}}>(%15 İndirim)</span>}
            </button>
          )
        )}
      </div>
        <CoffeeRight
  started={started}
  isLocked={isLocked}
  form={form}
  handleOptionSelect={handleOptionSelect}
  milkOptions={milkOptions}
  beanOptions={beanOptions}
  foamOptions={foamOptions}
  cupOptions={cupOptions}
  syrupOptions={syrupOptions}
  spiceOptions={spiceOptions}
  sweetenerOptions={sweetenerOptions}
  techniqueOptions={techniqueOptions}
/>

    </div>
  )
}