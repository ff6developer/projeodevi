"use client"
import { useState, useEffect } from "react"
import "../../styles/kahveniolustur.css"
import { useRouter } from "next/navigation"

export default function KahveniOlustur() {
  const router = useRouter()
  const [started, setStarted] = useState(false)

  const [form, setForm] = useState({
    milkType: null,
    beanType: null,
    foam: null,
    cupType: null,
    syrup: null,
    spice: null,
    sweetener: null,
    technique: null
  })

  // Tüm seçeneklerin seçilip seçilmediğini kontrol eder
  const allSelected =
    form.milkType &&
    form.beanType &&
    form.foam &&
    form.cupType &&
    form.syrup &&
    form.spice &&
    form.sweetener &&
    form.technique

  // SEÇENEK LİSTELERİ
  const milkOptions = [
    { name: "Laktozlu Süt", price: 10 },
    { name: "Laktozsuz Süt", price: 15 },
    { name: "Yulaf Sütü", price: 18 },
    { name: "Badem Sütü", price: 18 },
    { name: "Soya Sütü", price: 15 },
    { name: "Hindistan Cevizi", price: 20 },
    { name: "Proteinli Süt", price: 22 },
    { name: "Yağsız Süt", price: 8 },
    { name: "Süt İstemiyorum", price: 0 }
  ]

  const beanOptions = [
    { name: "Brezilya Çekirdeği", price: 20 },
    { name: "Kolombiya Çekirdeği", price: 25 },
    { name: "Etiyopya Çekirdeği", price: 30 },
    { name: "Guatemala Çekirdeği", price: 35 }
  ]

  const foamOptions = [
    { name: "Köpük Var", price: 5 },
    { name: "Köpük Yok", price: 0 }
  ]

  const cupOptions = [
    { name: "Karton Bardak", price: 0 },
    { name: "Cam Bardak", price: 8 },
    { name: "Termos Bardak", price: 20 },
    { name: "Büyük Boy Bardak", price: 12 }
  ]

  const syrupOptions = [
    { name: "Vanilya Şurubu", price: 15 },
    { name: "Karamel Şurubu", price: 18 },
    { name: "Fındık Şurubu", price: 18 },
    { name: "Çikolata Şurubu", price: 20 },
    { name: "Şurup İstemiyorum", price: 0 }
  ]

  const spiceOptions = [
    { name: "Tarçın", price: 6 },
    { name: "Kakao Tozu", price: 7 },
    { name: "Hindistan Cevizi", price: 10 },
    { name: "Muskat", price: 8 },
    { name: "Baharat İstemiyorum", price: 0 }
  ]

  const sweetenerOptions = [
    { name: "Beyaz Şeker", price: 4 },
    { name: "Esmer Şeker", price: 6 },
    { name: "Bal", price: 12 },
    { name: "Stevia", price: 10 },
    { name: "Tatlandırıcı İstemiyorum", price: 0 }
  ]

  const techniqueOptions = [
    { name: "Extra Shot", price: 22 },
    { name: "Daha Sıcak Servis", price: 3 },
    { name: "Ilık Servis", price: 0 },
    { name: "Buzlu Servis", price: 8 },
    { name: "Latte Art", price: 15 },
    { name: "Değişiklik Yok", price: 0 }
  ]

  const basePrice = 100

  // Toplam fiyat hesaplama
  const total =
    basePrice +
    (form.milkType?.price || 0) +
    (form.beanType?.price || 0) +
    (form.foam?.price || 0) +
    (form.cupType?.price || 0) +
    (form.syrup?.price || 0) +
    (form.spice?.price || 0) +
    (form.sweetener?.price || 0) +
    (form.technique?.price || 0)

  // SİPARİŞİ KAYDET VE YÖNLENDİR
  const handleSiparis = () => {
    if (!allSelected) return;

    const lastDesign = {
      id: Date.now(),
      name: `${form.beanType?.name} & ${form.milkType?.name}`,
      details: form,
      totalPrice: total,
      date: new Date().toLocaleDateString('tr-TR'),
      image: "/default-coffee.png" 
    }

    // Veriyi Profil sayfası için yerel depoya sakla
    localStorage.setItem("lastCoffeeDesign", JSON.stringify(lastDesign));
    
    // Sipariş sayfasına git
    router.push("/siparis");
  }

  // SMOOTH SCROLL LOGIC
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

        if (percent < 1) {
          requestAnimationFrame(animate)
        } else {
          animating = false
        }
      }
      requestAnimationFrame(animate)
    }

    const wheelHandler = (e: WheelEvent) => {
      if (animating) return
      animating = true

      if (e.deltaY > 0) {
        index = Math.min(index + 1, sections.length - 1)
      } else {
        index = Math.max(index - 1, 0)
      }

      const targetSection = sections[index] as HTMLElement
      smoothScroll(targetSection.offsetTop)
    }

    container.addEventListener("wheel", wheelHandler)
    return () => container.removeEventListener("wheel", wheelHandler)
  }, [started])

  return (
    <div className="coffee-layout">
      <div className="coffee-bg"></div>

      <div className="coffee-left">
        <h1 className="hero-title">Kahveni Tasarla.</h1>
        <p className="hero-sub">
          Her yudum senin karakterini yansıtsın.
          Kahveni adım adım oluştur ve kendi tarifini keşfet.
        </p>

        {!started ? (
          <button className="hero-btn" onClick={() => setStarted(true)}>
            Oluşturmaya Başla
          </button>
        ) : (
          <div className="price-bar">
            Toplam: {total} TL
          </div>
        )}

        {allSelected && (
          <button className="ready-btn" onClick={handleSiparis}>
            Sipariş Ver
          </button>
        )}
      </div>

      <div className="coffee-right">
        {started && (
          <>
            {/* SÜT */}
            <div className="config-section">
              <h2 className="section-title">Süt Tipi</h2>
              <div className="option-group">
                {milkOptions.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setForm({ ...form, milkType: item })}
                    className={form.milkType?.name === item.name ? "milk-item active" : "milk-item"}
                  >
                    <span>{item.name}</span>
                    <span>{item.price}₺</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ÇEKİRDEK */}
            <div className="config-section">
              <h2 className="section-title">Kahve Çekirdeği</h2>
              <div className="option-group">
                {beanOptions.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setForm({ ...form, beanType: item })}
                    className={form.beanType?.name === item.name ? "milk-item active" : "milk-item"}
                  >
                    <span>{item.name}</span>
                    <span>{item.price}₺</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KÖPÜK */}
            <div className="config-section">
              <h2 className="section-title">Süt Köpüğü</h2>
              <div className="option-group">
                {foamOptions.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setForm({ ...form, foam: item })}
                    className={form.foam?.name === item.name ? "milk-item active" : "milk-item"}
                  >
                    <span>{item.name}</span>
                    <span>{item.price}₺</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BARDAK */}
            <div className="config-section">
              <h2 className="section-title">Bardak Tipi</h2>
              <div className="option-group">
                {cupOptions.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setForm({ ...form, cupType: item })}
                    className={form.cupType?.name === item.name ? "milk-item active" : "milk-item"}
                  >
                    <span>{item.name}</span>
                    <span>{item.price}₺</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ŞURUP */}
            <div className="config-section">
              <h2 className="section-title">Şurup</h2>
              <div className="option-group">
                {syrupOptions.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setForm({ ...form, syrup: item })}
                    className={form.syrup?.name === item.name ? "milk-item active" : "milk-item"}
                  >
                    <span>{item.name}</span>
                    <span>{item.price}₺</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BAHARAT */}
            <div className="config-section">
              <h2 className="section-title">Aromatik Baharatlar</h2>
              <div className="option-group">
                {spiceOptions.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setForm({ ...form, spice: item })}
                    className={form.spice?.name === item.name ? "milk-item active" : "milk-item"}
                  >
                    <span>{item.name}</span>
                    <span>{item.price}₺</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TATLANDIRICI */}
            <div className="config-section">
              <h2 className="section-title">Tatlandırıcı</h2>
              <div className="option-group">
                {sweetenerOptions.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setForm({ ...form, sweetener: item })}
                    className={form.sweetener?.name === item.name ? "milk-item active" : "milk-item"}
                  >
                    <span>{item.name}</span>
                    <span>{item.price}₺</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TEKNİK */}
            <div className="config-section">
              <h2 className="section-title">Teknik</h2>
              <div className="option-group">
                {techniqueOptions.map(item => (
                  <div
                    key={item.name}
                    onClick={() => setForm({ ...form, technique: item })}
                    className={form.technique?.name === item.name ? "milk-item active" : "milk-item"}
                  >
                    <span>{item.name}</span>
                    <span>{item.price}₺</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}