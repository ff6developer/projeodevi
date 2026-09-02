"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import "@/styles/odeme.css"
import { useCart } from "@/components/CartProvider"
import { isLoggedIn, subscribe as subscribeAuth } from "@/lib/session"
import { computeCartTotals } from "@/lib/pricing"
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
  const { lines, hydrated } = useCart()

  const [step, setStep] = useState(0)
  const [triedNext, setTriedNext] = useState(false)
  const [state, setState] = useState<CheckoutState>(() => {
    const last = getLastAddress()
    return last ? { ...initialCheckoutState(), address: last } : initialCheckoutState()
  })

  const authed = useSyncExternalStore(
    subscribeAuth,
    () => isLoggedIn(),
    () => false,
  )

  useEffect(() => {
    if (!hydrated) return
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

  return (
    <div className="odeme container">
      <h1>Ödeme</h1>

      <Stepper steps={[...CHECKOUT_STEPS]} current={step} />

      <div className="odeme-layout">
        <Card pad="lg" className="odeme-panel">
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
            {!isLast && (
              <Button size="md" onClick={goNext} type="button">
                Devam et
              </Button>
            )}
          </div>
        </Card>

        <aside className="odeme-summary">
          <Card pad="md" elevated>
            <h2>Özet</h2>
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
          </Card>
        </aside>
      </div>
    </div>
  )
}
