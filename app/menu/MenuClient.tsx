"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { SearchX } from "lucide-react"
import "@/styles/menu.css"
import { useToast } from "@/components/ToastProvider"
import {
  Button,
  Card,
  Badge,
  Select,
  Price,
  RoastMeter,
  OriginTag,
  EmptyState,
} from "@/components/ui"
import { CATEGORY_LABEL, getByCategory } from "@/lib/products"
import type { Product, ProductCategory } from "@/lib/types"
import { addProduct } from "@/lib/cart"
import { getChampion } from "@/lib/community"

const CATEGORIES: ProductCategory[] = ["sicak", "soguk", "tatli"]

type Sampiyon = { name: string; creator: string; image?: string }

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
  const [sampiyon, setSampiyon] = useState<Sampiyon | null>(null)

  // Yalnızca istemcide, hidrasyondan sonra oku (SSR uyuşmazlığını önlemek için).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSampiyon(getChampion<Sampiyon>())
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

  const sepeteEkle = (p: Product) => {
    addProduct({ productId: p.id, slug: p.slug, name: p.name, image: p.image, unitKurus: p.priceKurus })
    toast.success(`${p.name} sepete eklendi.`, { action: { label: "Sepete git", href: "/sepet" } })
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
          <EmptyState
            icon={<SearchX size={30} />}
            title="Bu kategoride ürün yok"
            description="Başka bir kategoriye göz atabilirsin."
          />
        ) : (
          <div className="menu-grid">
            {urunler.map((p) => (
              <Card key={p.id} className="menu-card" pad="sm">
                <Link href={`/menu/${p.slug}`} className="menu-card-open">
                  <span className="menu-card-img">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 280px" />
                  </span>
                  <h2 className="menu-card-name">{p.name}</h2>
                </Link>
                <div className="menu-card-spec">
                  {p.roast && <RoastMeter level={p.roast} />}
                  {p.origin && <OriginTag origin={p.origin} />}
                </div>
                <div className="menu-card-foot">
                  <Price value={p.priceKurus} className="menu-card-price" />
                  <Button size="md" variant="secondary" block onClick={() => sepeteEkle(p)}>
                    Sepete ekle
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
