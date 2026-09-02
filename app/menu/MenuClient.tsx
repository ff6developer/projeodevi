"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Star, ImagePlus, X } from "lucide-react"
import "@/styles/menu.css"
import { useToast } from "@/components/ToastProvider"
import {
  Button,
  Card,
  Badge,
  Modal,
  Textarea,
  Select,
  Price,
  RoastMeter,
  OriginTag,
  TastingNotes,
  EmptyState,
} from "@/components/ui"
import { CATEGORY_LABEL, getByCategory } from "@/lib/products"
import type { Product, ProductCategory } from "@/lib/types"
import { addProduct } from "@/lib/cart"
import { FREE_SHIPPING_THRESHOLD_KURUS } from "@/lib/pricing"
import { formatPrice } from "@/lib/format"

type Yorum = { puan: number; metin: string; gorsel?: string }
const YORUM_KEY = "menuYorumlar"

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
    <span className="star-rating" role={readOnly ? "img" : "radiogroup"} aria-label={`Puan: ${value}/5`}>
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

const CATEGORIES: ProductCategory[] = ["sicak", "soguk", "tatli"]

type Sampiyon = { name: string; creator: string; image?: string }

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

type SortKey = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "isim"
const SORT_KEYS: SortKey[] = ["onerilen", "fiyat-artan", "fiyat-azalan", "isim"]
const SORT_LABEL: Record<SortKey, string> = {
  onerilen: "Önerilen",
  "fiyat-artan": "Fiyat: artan",
  "fiyat-azalan": "Fiyat: azalan",
  isim: "İsim (A–Z)",
}

export default function MenuClient() {
  const toast = useToast()
  const searchParams = useSearchParams()

  const [kategori, setKategori] = useState<ProductCategory>(() => {
    const k = searchParams.get("kategori")
    return CATEGORIES.includes(k as ProductCategory) ? (k as ProductCategory) : "sicak"
  })
  const [sirala, setSirala] = useState<SortKey>(() => {
    const s = searchParams.get("sirala")
    return SORT_KEYS.includes(s as SortKey) ? (s as SortKey) : "onerilen"
  })
  const [detay, setDetay] = useState<Product | null>(null)
  const [yorumlar, setYorumlar] = useState<Record<number, Yorum[]>>(() =>
    readJSON<Record<number, Yorum[]>>(YORUM_KEY, {}),
  )
  const [yeniMetin, setYeniMetin] = useState("")
  const [yeniPuan, setYeniPuan] = useState(5)
  const [yeniGorsel, setYeniGorsel] = useState<string>("")
  const [sampiyon, setSampiyon] = useState<Sampiyon | null>(null)

  // Yalnızca istemcide, hidrasyondan sonra oku (SSR uyuşmazlığını önlemek için).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSampiyon(readJSON<Sampiyon | null>("arenaChampion", null))
  }, [])

  // Kategori/sıralama değişince URL'i güncelle (paylaşılabilir bağlantı).
  useEffect(() => {
    const q = new URLSearchParams()
    if (kategori !== "sicak") q.set("kategori", kategori)
    if (sirala !== "onerilen") q.set("sirala", sirala)
    const qs = q.toString()
    window.history.replaceState(null, "", qs ? `/menu?${qs}` : "/menu")
  }, [kategori, sirala])

  const urunler = useMemo(() => {
    const list = [...getByCategory(kategori)]
    switch (sirala) {
      case "fiyat-artan":
        return list.sort((a, b) => a.priceKurus - b.priceKurus)
      case "fiyat-azalan":
        return list.sort((a, b) => b.priceKurus - a.priceKurus)
      case "isim":
        return list.sort((a, b) => a.name.localeCompare(b.name, "tr"))
      default:
        return list
    }
  }, [kategori, sirala])

  const resetForm = () => {
    setYeniMetin("")
    setYeniPuan(5)
    setYeniGorsel("")
  }

  const gorselSec = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.warning("Görsel 2 MB'dan küçük olmalı.")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setYeniGorsel(reader.result as string)
    reader.readAsDataURL(file)
  }

  const yorumGonder = () => {
    if (!detay || (!yeniMetin.trim() && !yeniGorsel)) return
    const next = {
      ...yorumlar,
      [detay.id]: [...(yorumlar[detay.id] ?? []), { puan: yeniPuan, metin: yeniMetin.trim(), gorsel: yeniGorsel || undefined }],
    }
    setYorumlar(next)
    try {
      localStorage.setItem(YORUM_KEY, JSON.stringify(next))
    } catch {
      /* yoksay */
    }
    resetForm()
    toast.success("Yorumun eklendi.")
  }

  const sepeteEkle = (p: Product) => {
    addProduct({ productId: p.id, slug: p.slug, name: p.name, image: p.image, unitKurus: p.priceKurus })
    toast.success(`${p.name} sepete eklendi.`)
  }

  return (
    <div className="menu-page">
      <div className="container">
        <p className="eyebrow">{CATEGORY_LABEL[kategori]}</p>
        <h1 className="menu-title">Menü</h1>

        {sampiyon && (
          <Card className="menu-champion" pad="md">
            <div className="menu-champion-row">
              <Badge tone="accent">Ayın öne çıkan tasarımı</Badge>
              <div className="menu-champion-body">
                <p className="menu-champion-name">{sampiyon.name}</p>
                <p className="menu-champion-creator">
                  Tasarlayan: <strong>{sampiyon.creator}</strong>
                </p>
              </div>
              {sampiyon.image && (
                <span className="menu-champion-img">
                  <Image src={sampiyon.image} alt={sampiyon.name} width={72} height={72} />
                </span>
              )}
              <Button href="/topluluk" variant="secondary" size="md">
                Topluluğa git
              </Button>
            </div>
          </Card>
        )}

        <div className="menu-toolbar">
          <div className="menu-cats" role="tablist" aria-label="Kategoriler">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={kategori === c}
                className={`menu-cat${kategori === c ? " is-active" : ""}`}
                onClick={() => setKategori(c)}
              >
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
          <Select
            label="Sırala"
            className="menu-sort"
            value={sirala}
            onChange={(e) => setSirala(e.target.value as SortKey)}
          >
            {SORT_KEYS.map((k) => (
              <option key={k} value={k}>
                {SORT_LABEL[k]}
              </option>
            ))}
          </Select>
        </div>

        {urunler.length === 0 ? (
          <EmptyState title="Bu kategoride ürün yok" />
        ) : (
          <div className="menu-grid">
            {urunler.map((p) => (
              <Card key={p.id} className="menu-card" pad="sm">
                <span className="menu-card-img">
                  <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 280px" />
                </span>
                <h2 className="menu-card-name">{p.name}</h2>
                <div className="menu-card-spec">
                  {p.roast && <RoastMeter level={p.roast} />}
                  {p.origin && <OriginTag origin={p.origin} />}
                </div>
                <div className="menu-card-foot">
                  <Price value={p.priceKurus} className="menu-card-price" />
                  <div className="menu-card-actions">
                    <Button variant="ghost" size="md" onClick={() => setDetay(p)}>
                      İncele
                    </Button>
                    <Button size="md" onClick={() => sepeteEkle(p)}>
                      Sepete ekle
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {detay && (
        <Modal open onClose={() => setDetay(null)} title={detay.name} wide>
          <div className="menu-detail">
            <span className="menu-detail-img">
              <Image src={detay.image} alt={detay.name} fill sizes="(max-width: 720px) 92vw, 400px" />
            </span>
            <div className="menu-detail-body">
              {detay.description && <p className="menu-detail-desc">{detay.description}</p>}
              <div className="menu-detail-spec">
                {detay.roast && <RoastMeter level={detay.roast} />}
                {detay.origin && <OriginTag origin={detay.origin} />}
                {detay.notes && <TastingNotes notes={detay.notes} />}
              </div>
              <div className="menu-detail-buy">
                <Price value={detay.priceKurus} />
                <Button onClick={() => sepeteEkle(detay)}>Sepete ekle</Button>
              </div>
              <p className="menu-detail-ship">
                Siparişe göre taze hazırlanır · {formatPrice(FREE_SHIPPING_THRESHOLD_KURUS)} üzeri
                ücretsiz kargo
              </p>
            </div>
          </div>

          <section className="menu-comments">
            <h3 className="menu-comments-title">
              Yorumlar ({yorumlar[detay.id]?.length ?? 0})
            </h3>

            <div className="menu-comments-list">
              {(yorumlar[detay.id] ?? []).map((y, i) => (
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
              {!(yorumlar[detay.id]?.length) && (
                <p className="menu-comments-empty">İlk yorumu sen yaz.</p>
              )}
            </div>

            <div className="menu-comment-form">
              <StarRating value={yeniPuan} onChange={setYeniPuan} />
              <Textarea
                label="Yorumun"
                placeholder="Kahve nasıldı?"
                value={yeniMetin}
                onChange={(e) => setYeniMetin(e.target.value)}
              />
              <div className="menu-comment-form-row">
                <label className="menu-comment-upload">
                  <ImagePlus size={16} aria-hidden="true" />
                  Görsel ekle
                  <input type="file" accept="image/*" hidden onChange={gorselSec} />
                </label>
                {yeniGorsel && (
                  <span className="menu-comment-preview">
                    <Image src={yeniGorsel} alt="Önizleme" width={56} height={42} />
                    <button
                      type="button"
                      className="menu-comment-preview-x"
                      aria-label="Görseli kaldır"
                      onClick={() => setYeniGorsel("")}
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                <Button size="md" onClick={yorumGonder} disabled={!yeniMetin.trim() && !yeniGorsel}>
                  Gönder
                </Button>
              </div>
            </div>
          </section>
        </Modal>
      )}
    </div>
  )
}
