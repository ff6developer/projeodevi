import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProducts, getProduct, CATEGORY_LABEL } from "@/lib/products"
import { SITE_URL, SITE_NAME } from "@/app/site-config"
import { formatPrice } from "@/lib/format"
import UrunDetayClient from "./UrunDetayClient"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getProducts().map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: "Ürün bulunamadı" }

  const desc =
    product.description ??
    `${product.name} — ${CATEGORY_LABEL[product.category]}. ${formatPrice(product.priceKurus)}.`
  const path = `/menu/${product.slug}`

  return {
    title: product.name,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: `${product.name} · ${SITE_NAME}`,
      description: desc,
      url: path,
      images: [{ url: product.image }],
    },
  }
}

export default async function UrunDetayPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE_URL}${product.image}`,
    category: CATEGORY_LABEL[product.category],
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: (product.priceKurus / 100).toFixed(2),
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/menu/${product.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UrunDetayClient product={product} />
    </>
  )
}
