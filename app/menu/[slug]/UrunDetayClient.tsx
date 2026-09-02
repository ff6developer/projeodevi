"use client"

import { useState, type ChangeEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Star, X } from "lucide-react"
import "@/styles/menu.css"
import { useToast } from "@/components/ToastProvider"
import {
  Button,
  Price,
  RoastMeter,
  OriginTag,
  TastingNotes,
  QuantityStepper,
  Textarea,
} from "@/components/ui"
import type { Product } from "@/lib/types"
import { addProduct } from "@/lib/cart"
import { FREE_SHIPPING_THRESHOLD_KURUS } from "@/lib/pricing"
import { formatPrice } from "@/lib/format"
import { getReviews, addReview, type Review } from "@/lib/reviews"

function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number
  onChange?: (v: number) => void
  readOnly?: boolean
}) {
  return (
    <span
      className="star-rating"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Puan: ${value}/5`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className="star-btn"
          aria-label={`${s} yıldız`}
          aria-pressed={!readOnly && s <= value}
          disabled={readOnly}
          onClick={() => onChange?.(s)}
        >
          <Star
            size={readOnly ? 14 : 20}
            fill={s <= value ? "var(--accent)" : "none"}
            color={s <= value ? "var(--accent)" : "var(--line-strong)"}
          />
        </button>
      ))}
    </span>
  )
}

export default function UrunDetayClient({ product }: { product: Product }) {
  const toast = useToast()

  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState<Record<number, Review[]>>(() => getReviews())
  const [metin, setMetin] = useState("")
  const [puan, setPuan] = useState(5)
  const [gorsel, setGorsel] = useState("")

  const list = reviews[product.id] ?? []

  const sepeteEkle = () => {
    addProduct({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitKurus: product.priceKurus,
      qty,
    })
    toast.success(`${product.name} sepete eklendi.`, {
      action: { label: "Sepete git", href: "/sepet" },
    })
    setQty(1)
  }

  const gorselSec = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.warning("Görsel 2 MB'dan küçük olmalı.")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setGorsel(reader.result as string)
    reader.readAsDataURL(file)
  }

  const yorumGonder = () => {
    if (!metin.trim() && !gorsel) return
    const next = addReview(product.id, {
      puan,
      metin: metin.trim(),
      gorsel: gorsel || undefined,
    })
    setReviews(next)
    setMetin("")
    setPuan(5)
    setGorsel("")
    toast.success("Yorumun eklendi.")
  }

  return (
    <div className="urun-detay container">
      <Link href="/menu" className="urun-detay-back">
        <ArrowLeft size={16} aria-hidden="true" />
        Menü
      </Link>

      <div className="menu-detail urun-detay-grid">
        <span className="menu-detail-img">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 720px) 92vw, 420px"
          />
        </span>
        <div className="menu-detail-body">
          <p className="eyebrow">Menü</p>
          <h1 className="urun-detay-title">{product.name}</h1>
          {product.description && (
            <p className="menu-detail-desc">{product.description}</p>
          )}
          <div className="menu-detail-spec">
            {product.roast && <RoastMeter level={product.roast} />}
            {product.origin && <OriginTag origin={product.origin} />}
            {product.notes && <TastingNotes notes={product.notes} />}
          </div>
          <div className="urun-detay-buy">
            <Price value={product.priceKurus} className="urun-detay-price" />
            <QuantityStepper value={qty} onChange={setQty} />
            <Button onClick={sepeteEkle}>Sepete ekle</Button>
          </div>
          <p className="menu-detail-ship">
            Siparişe göre taze hazırlanır · {formatPrice(FREE_SHIPPING_THRESHOLD_KURUS)} üzeri
            ücretsiz kargo
          </p>
        </div>
      </div>

      <section className="menu-comments">
        <h2 className="menu-comments-title">Yorumlar ({list.length})</h2>

        <div className="menu-comments-list">
          {list.map((y, i) => (
            <div key={i} className="menu-comment">
              <StarRating value={y.puan} readOnly />
              {y.metin && <p className="menu-comment-text">{y.metin}</p>}
              {y.gorsel && (
                <span className="menu-comment-img">
                  <Image src={y.gorsel} alt="Yorum görseli" width={220} height={150} />
                </span>
              )}
            </div>
          ))}
          {list.length === 0 && (
            <p className="menu-comments-empty">İlk yorumu sen yaz.</p>
          )}
        </div>

        <div className="menu-comment-form">
          <StarRating value={puan} onChange={setPuan} />
          <Textarea
            label="Yorumun"
            placeholder="Kahve nasıldı?"
            value={metin}
            onChange={(e) => setMetin(e.target.value)}
          />
          <div className="menu-comment-form-row">
            <label className="menu-comment-upload">
              <ImagePlus size={16} aria-hidden="true" />
              Görsel ekle
              <input type="file" accept="image/*" hidden onChange={gorselSec} />
            </label>
            {gorsel && (
              <span className="menu-comment-preview">
                <Image src={gorsel} alt="Önizleme" width={56} height={42} />
                <button
                  type="button"
                  className="menu-comment-preview-x"
                  aria-label="Görseli kaldır"
                  onClick={() => setGorsel("")}
                >
                  <X size={14} />
                </button>
              </span>
            )}
            <Button size="md" onClick={yorumGonder} disabled={!metin.trim() && !gorsel}>
              Gönder
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
