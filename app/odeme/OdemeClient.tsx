"use client"

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import "@/styles/odeme.css"
import { useCart } from "@/components/CartProvider"
import { useToast } from "@/components/ToastProvider"
import { getUser, isLoggedIn, subscribe as subscribeAuth } from "@/lib/session"
import { computeCartTotals } from "@/lib/pricing"
import { createOrder } from "@/lib/orders"
import type { OrderItem } from "@/lib/types"
import {
  CHECKOUT_STEPS,
  canAdvance,
  getLastAddress,
  initialCheckoutState,
  saveLastAddress,
  type CheckoutState,
} from "@/lib/checkout"
import { Button, Card, Stepper, LoadingState, Price } from "@/components/ui"
import AddressStep from "./steps/AddressStep"
import DeliveryStep from "./steps/DeliveryStep"
import PaymentStep from "./steps/PaymentStep"
import ReviewStep from "./steps/ReviewStep"

export default function OdemeClient() {
  const router = useRouter()
  const toast = useToast()
  const { lines, hydrated, clear } = useCart()

  const [step, setStep] = useState(0)
  const [triedNext, setTriedNext] = useState(false)
  const [placing, setPlacing] = useState(false)
  const placedRef = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CheckoutState>(() => {
    const last = getLastAddress()
    return last ? { ...initialCheckoutState(), address: last } : initialCheckoutState()
  })

  const authed = useSyncExternalStore(
    subscribeAuth,
    () => isLoggedIn(),
    () => false,
  )

  // Geçersiz "Devam" denemesinde ilk hatalı alana odaklan/kaydır.
  useEffect(() => {
    if (!triedNext) return
    const first = panelRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    if (!first) return
    first.focus()
    first.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [triedNext, step])

  useEffect(() => {
    if (!hydrated || placedRef.current) return
    if (!authed) {
      router.replace("/giris?next=/odeme")
      return
    }
    if (lines.length === 0) router.replace("/sepet")
  }, [hydrated, authed, lines.length, router])

  const totals = useMemo(
    () => computeCartTotals({ lines, delivery: state.delivery }),
    [lines, state.delivery],
  )

  if (!hydrated || !authed || lines.length === 0) {
    return (
      <div className="odeme container container-narrow">
        <LoadingState label="Ödeme hazırlanıyor" />
      </div>
    )
  }

  const canNext = canAdvance(step, state)
  const isLast = step === CHECKOUT_STEPS.length - 1

  const goNext = () => {
    if (!canNext) {
      setTriedNext(true)
      return
    }
    if (step === 0) saveLastAddress(state.address)
    setTriedNext(false)
    setStep((s) => Math.min(CHECKOUT_STEPS.length - 1, s + 1))
  }
  const goBack = () => {
    setTriedNext(false)
    setStep((s) => Math.max(0, s - 1))
  }

  const placeOrder = () => {
    if (placing) return
    placedRef.current = true
    setPlacing(true)
    try {
      const items: OrderItem[] = lines.map((l) =>
        l.kind === "product"
          ? {
              kind: "product",
              name: l.name,
              image: l.image ?? null,
              unitKurus: l.unitKurus,
              qty: l.qty,
            }
          : {
              kind: "recipe",
              name: l.name,
              image: l.image ?? null,
              unitKurus: l.unitKurus,
              qty: l.qty,
              recipe: l.recipe,
              score: l.score,
              fromArena: l.fromArena,
            },
      )

      const order = createOrder({
        items,
        address: state.address,
        delivery: state.delivery,
        payment: state.payment,
        subtotalKurus: totals.subtotalKurus,
        discountKurus: totals.discountKurus,
        shippingKurus: totals.shippingKurus,
        totalKurus: totals.totalKurus,
        userEmail: getUser()?.email,
      })

      clear()
      toast.success("Siparişin alındı.")
      router.replace(`/siparis?o=${order.id}`)
    } catch {
      placedRef.current = false
      setPlacing(false)
      toast.error("Siparişin oluşturulamadı, lütfen tekrar dene.")
    }
  }

  return (
    <div className="odeme container">
      <h1>Ödeme</h1>

      <Stepper steps={[...CHECKOUT_STEPS]} current={step} />

      <div className="odeme-layout">
        <Card pad="lg" className="odeme-panel" ref={panelRef}>
          {step === 0 && (
            <AddressStep state={state} setState={setState} showErrors={triedNext} />
          )}
          {step === 1 && <DeliveryStep state={state} setState={setState} totals={totals} />}
          {step === 2 && (
            <PaymentStep state={state} setState={setState} showErrors={triedNext} />
          )}
          {step === 3 && <ReviewStep state={state} lines={lines} totals={totals} />}

          <div className="odeme-actions">
            {step > 0 && (
              <Button variant="ghost" size="md" onClick={goBack} type="button">
                Geri
              </Button>
            )}
            {!isLast ? (
              <Button size="md" onClick={goNext} type="button">
                Devam et
              </Button>
            ) : (
              <Button size="md" onClick={placeOrder} type="button" loading={placing}>
                Siparişi onayla
              </Button>
            )}
          </div>
        </Card>

        <aside className="odeme-summary">
          <Card pad="md" elevated>
            <h2>Özet</h2>

            <details className="odeme-summary-items" open>
              <summary>
                {lines.reduce((n, l) => n + l.qty, 0)} ürün
              </summary>
              <ul>
                {lines.map((l) => (
                  <li key={l.lineId}>
                    <span className="odeme-summary-item-name">
                      {l.name}
                      {l.qty > 1 ? ` × ${l.qty}` : ""}
                    </span>
                    <Price value={l.unitKurus * l.qty} />
                  </li>
                ))}
              </ul>
            </details>

            <div className="odeme-summary-row">
              <span>Ara toplam</span>
              <Price value={totals.subtotalKurus} />
            </div>
            <div className="odeme-summary-row">
              <span>Teslimat</span>
              {totals.shippingKurus === 0 ? (
                <span>Ücretsiz</span>
              ) : (
                <Price value={totals.shippingKurus} />
              )}
            </div>
            <div className="odeme-summary-row odeme-summary-total">
              <span>Toplam</span>
              <Price value={totals.totalKurus} />
            </div>

            <p className="odeme-summary-trust">
              Bilgilerin yalnızca bu sipariş için kullanılır. Demo ortamı — gerçek
              ödeme alınmaz.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  )
}
