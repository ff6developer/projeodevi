"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/siparis.css"

export default function SiparisClient(){
  const router = useRouter()
  const [dots,setDots] = useState(".")
  const [lastOrder, setLastOrder] = useState<any>(null)
  const [checked, setChecked] = useState(false)

  useEffect(()=>{
    const interval = setInterval(()=>{
      setDots(prev=>{
        if(prev === "...") return "."
        return prev + "."
      })
    },500)
    return ()=> clearInterval(interval)
  },[])

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      setLastOrder(orders.length > 0 ? orders[orders.length - 1] : null)
    } catch {
      setLastOrder(null)
    }
    setChecked(true)
  }, [])

  return (
   <div className="siparis-page">
 <div className="siparis-overlay"></div>
 <div className="siparis-content">
 <h1 className="siparis-hero">
    Siparişiniz Hazırlanıyor{dots}
 </h1>

        <p className="siparis-desc">
          Kahveniz hazır olduktan sonra profil bölümünden tasarımınızı paylaşın ve
          turnuvadaki sürpriz ödülleri kazanma şansını yakalayın!
        </p>

        {checked && (
          <>
            {lastOrder ? (
              <div className="siparis-order-summary">
                <div className="siparis-order-row">
                  <span className="siparis-order-label">Kahveniz</span>
                  <span className="siparis-order-value">{lastOrder.coffeeName || "İsimsiz Kahve"}</span>
                </div>
                <div className="siparis-order-row">
                  <span className="siparis-order-label">Tutar</span>
                  <span className="siparis-order-value">
                    ₺{lastOrder.totalPrice}
                    {lastOrder.discountApplied ? (
                      <span className="siparis-order-discount"> (%{lastOrder.discountApplied} indirim uygulandı)</span>
                    ) : null}
                  </span>
                </div>
                <div className="siparis-order-row">
                  <span className="siparis-order-label">Durum</span>
                  <span className="siparis-order-value">{lastOrder.status}</span>
                </div>
              </div>
            ) : (
              <p className="siparis-desc siparis-fallback-note">
                Görüntülenecek aktif bir sipariş bulunamadı.
              </p>
            )}

            <div className="siparis-actions">
              <button className="siparis-btn siparis-btn-primary" onClick={() => router.push("/profil")}>
                Profilime Git
              </button>
              <button className="siparis-btn siparis-btn-secondary" onClick={() => router.push("/menu")}>
                Menüye Dön
              </button>
            </div>
          </>
        )}
   </div>
 </div>
  )}