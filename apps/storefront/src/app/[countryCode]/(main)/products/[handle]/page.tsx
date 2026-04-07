import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPageByHandle } from "@lib/payload/get-product-page"
import { getSiteSettings } from "@lib/payload/get-site-settings"
import { getPayloadMediaUrl } from "@lib/payload/client"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { getSeoToolkitSiteName } from "@lib/util/plugin-manifest"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return []
}

type VariantImageMetadata = {
  images?: Array<{
    url?: string | null
  }> | null
  thumbnail?: string | null
}

const getVariantMetadataImages = (
  product: HttpTypes.StoreProduct,
  variant: HttpTypes.StoreProductVariant
) => {
  const metadata = (variant.metadata ?? null) as VariantImageMetadata | null
  const urls = [
    typeof metadata?.thumbnail === "string" ? metadata.thumbnail : null,
    ...(metadata?.images?.map((image) => image?.url ?? null) ?? []),
  ].filter((url): url is string => Boolean(url))

  if (!urls.length) {
    return []
  }

  const seenUrls = new Set<string>()
  const productImagesByUrl = new Map(
    (product.images ?? [])
      .filter((image): image is HttpTypes.StoreProductImage & { url: string } =>
        Boolean(image.url)
      )
      .map((image) => [image.url, image])
  )

  return urls.flatMap((url, index) => {
    if (seenUrls.has(url)) {
      return []
    }

    seenUrls.add(url)

    return [
      productImagesByUrl.get(url) ??
        ({
          id: `${variant.id}-metadata-image-${index}`,
          url,
        } as HttpTypes.StoreProductImage),
    ]
  })
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  const productImages = product.images ?? []

  if (!selectedVariantId || !product.variants) {
    return productImages
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  const variantImages = variant?.images ?? []

  if (!variant) {
    return productImages
  }

  if (variantImages.length > 0) {
    const imageIdsMap = new Map(
      variantImages
        .filter((image): image is HttpTypes.StoreProductImage & { id: string } =>
          Boolean(image.id)
        )
        .map((image) => [image.id, true])
    )

    const matchedImages = productImages.filter(
      (image) => image.id && imageIdsMap.has(image.id)
    )

    return matchedImages.length > 0 ? matchedImages : variantImages
  }

  const metadataImages = getVariantMetadataImages(product, variant)

  return metadataImages.length > 0 ? metadataImages : productImages
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const [productPage, siteSettings] = await Promise.all([
    getProductPageByHandle(handle),
    getSiteSettings(),
  ])

  const siteName =
    siteSettings?.siteName?.trim() || getSeoToolkitSiteName()
  const seoTitle =
    productPage?.seo?.metaTitle?.trim() || `${product.title} | ${siteName}`
  const seoDescription =
    productPage?.seo?.metaDescription?.trim() || `${product.title}`
  const seoImage =
    getPayloadMediaUrl(productPage?.seo?.ogImage?.url) || product.thumbnail || undefined

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: seoImage ? [seoImage] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId)
  const productPage = await getProductPageByHandle(params.handle)

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      images={images}
      selectedVariantId={selectedVariantId}
      contentBlocks={productPage?.sections}
    />
  )
}
