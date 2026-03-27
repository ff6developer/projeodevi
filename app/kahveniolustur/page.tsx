"use client"
import { useState, useEffect } from "react"
import "../../styles/kahveniolustur.css"
import { useRouter } from "next/navigation"
import { Camera, Beaker, Zap, Trophy, Info, X, CheckCircle2 } from "lucide-react"

export default function KahveniOlustur() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [coffeeImage, setCoffeeImage] = useState<string | null>(null)
  const [coffeeName, setCoffeeName] = useState("")

  // Form State
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

  const allSelected =
    form.milkType && form.beanType && form.foam && form.cupType && 
    form.syrup && form.spice && form.sweetener && form.technique

  // --- SEÇENEK LİSTELERİ ---
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

  // Yaratıcılık Puanı Hesaplama (Arena İçin)
  const creativityScore = 
    (form.milkType?.power || 0) + (form.beanType?.power || 0) + 
    (form.syrup?.power || 0) + (form.technique?.power || 0) + 
    (form.spice?.power || 0);

  const total = 100 + (form.milkType?.price || 0) + (form.beanType?.price || 0) + 
    (form.foam?.price || 0) + (form.cupType?.price || 0) + (form.syrup?.price || 0) + 
    (form.spice?.price || 0) + (form.sweetener?.price || 0) + (form.technique?.price || 0)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setCoffeeImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSiparis = () => {
    if (!allSelected) return;
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      alert("Arenada yarışmak için önce giriş yapmalısın!");
      router.push("/giris");
      return;
    }

    if (!coffeeImage || !coffeeName.trim()) {
      alert("Arenaya çıkmadan önce kahvene bir isim ver ve fotoğrafını yükle!");
      return;
    }

    const arenaDesign = {
      id: Date.now(),
      name: coffeeName,
      details: form,
      totalPrice: total,
      score: creativityScore,
      image: coffeeImage,
      date: new Date().toLocaleDateString('tr-TR')
    }

    localStorage.setItem("lastCoffeeDesign", JSON.stringify(arenaDesign));
    alert("Kahven Arenaya gönderilmeye hazır! Profilinde paylaşarak oyları toplamaya başlayabilirsin. 🔥");
    router.push("/siparis");
  }

  // Smooth Scroll
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
      if(targetSection) smoothScroll(targetSection.offsetTop)
    }
    container.addEventListener("wheel", wheelHandler)
    return () => container.removeEventListener("wheel", wheelHandler)
  }, [started])

  return (
    <div className="coffee-layout">
      <div className="coffee-bg"></div>

      {/* SOL PANEL: STATS & ACTION */}
      <div className="coffee-left">
        <div className="lab-badge"><Beaker size={16} /> THE COFFEE LAB</div>
        <h1 className="hero-title">Şampiyonu Tasarla.</h1>
        <p className="hero-sub">
          Arenada yarışacak kahveni tasarlıyorsun. Her seçim yaratıcılık puanını artırır!
        </p>

        {started && (
          <div className="arena-stats-container">
            <div className="arena-stat-box">
              <span className="stat-label"><Zap size={14} color="#ffd59e"/> Yaratıcılık Puanı</span>
              <span className="stat-value">{creativityScore}</span>
            </div>
            <div className="arena-stat-box">
              <span className="stat-label">Toplam Fiyat</span>
              <span className="stat-value">{total} TL</span>
            </div>
          </div>
        )}

        {!started ? (
          <button className="hero-btn" onClick={() => setStarted(true)}>Laboratuvarı Aç</button>
        ) : (
          allSelected && (
            <div className="final-arena-step">
              <input 
                type="text" 
                placeholder="Kahvene bir isim ver..." 
                className="arena-name-input"
                value={coffeeName}
                onChange={(e) => setCoffeeName(e.target.value)}
              />
              
              <label className={`arena-photo-upload ${coffeeImage ? 'has-img' : ''}`}>
                {coffeeImage ? (
                  <img src={coffeeImage} alt="Önizleme" />
                ) : (
                  <>
                    <Camera size={24} />
                    <span>Arena Görseli Ekle</span>
                  </>
                )}
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </label>

              <button className="ready-btn arena-btn" onClick={handleSiparis}>
                <Trophy size={18} /> Arenaya Gönder
              </button>
            </div>
          )
        )}
      </div>

      {/* SAĞ PANEL: SEÇENEKLER */}
      <div className="coffee-right">
        {started && (
          <>
            <section className="config-section">
              <h2 className="section-title">Süt Tipi</h2>
              <div className="option-group">
                {milkOptions.map(item => (
                  <div key={item.name} onClick={() => setForm({ ...form, milkType: item })} className={`milk-item ${form.milkType?.name === item.name ? "active" : ""}`}>
                    <span>{item.name}</span>
                    <span>+{item.power} Puan</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2 className="section-title">Kahve Çekirdeği</h2>
              <div className="option-group">
                {beanOptions.map(item => (
                  <div key={item.name} onClick={() => setForm({ ...form, beanType: item })} className={`milk-item ${form.beanType?.name === item.name ? "active" : ""}`}>
                    <span>{item.name}</span>
                    <span>+{item.power} Puan</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2 className="section-title">Süt Köpüğü</h2>
              <div className="option-group">
                {foamOptions.map(item => (
                  <div key={item.name} onClick={() => setForm({ ...form, foam: item })} className={`milk-item ${form.foam?.name === item.name ? "active" : ""}`}>
                    <span>{item.name}</span>
                    <span>+{item.power} Puan</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2 className="section-title">Bardak Tipi</h2>
              <div className="option-group">
                {cupOptions.map(item => (
                  <div key={item.name} onClick={() => setForm({ ...form, cupType: item })} className={`milk-item ${form.cupType?.name === item.name ? "active" : ""}`}>
                    <span>{item.name}</span>
                    <span>+{item.power} Puan</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2 className="section-title">Şurup</h2>
              <div className="option-group">
                {syrupOptions.map(item => (
                  <div key={item.name} onClick={() => setForm({ ...form, syrup: item })} className={`milk-item ${form.syrup?.name === item.name ? "active" : ""}`}>
                    <span>{item.name}</span>
                    <span>+{item.power} Puan</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2 className="section-title">Baharatlar</h2>
              <div className="option-group">
                {spiceOptions.map(item => (
                  <div key={item.name} onClick={() => setForm({ ...form, spice: item })} className={`milk-item ${form.spice?.name === item.name ? "active" : ""}`}>
                    <span>{item.name}</span>
                    <span>+{item.power} Puan</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2 className="section-title">Tatlandırıcı</h2>
              <div className="option-group">
                {sweetenerOptions.map(item => (
                  <div key={item.name} onClick={() => setForm({ ...form, sweetener: item })} className={`milk-item ${form.sweetener?.name === item.name ? "active" : ""}`}>
                    <span>{item.name}</span>
                    <span>+{item.power} Puan</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2 className="section-title">Özel Teknik</h2>
              <div className="option-group">
                {techniqueOptions.map(item => (
                  <div key={item.name} onClick={() => setForm({ ...form, technique: item })} className={`milk-item ${form.technique?.name === item.name ? "active" : ""}`}>
                    <span>{item.name}</span>
                    <span>+{item.power} Puan</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}