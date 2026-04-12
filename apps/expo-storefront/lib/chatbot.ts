import type { HttpTypes } from "@medusajs/types";

import { formatPrice } from "@/lib/format-price";
import { isVariantInStock } from "@/lib/inventory";

export type ChatbotSettings = {
  is_enabled: boolean;
  title: string;
  welcome_message: string;
  placeholder_text: string;
  suggested_questions: string[];
  fallback_message: string;
  handoff_message: string;
};

export type ChatbotSource = {
  type: "faq" | "policy" | "product" | "catalog" | "fallback";
  label: string;
};

export type ChatbotCatalogItem = {
  id: string;
  title: string;
  handle: string;
  subtitle?: string | null;
  thumbnail?: string | null;
  collection_title?: string | null;
  product_type?: string | null;
  price?: string | null;
  original_price?: string | null;
  currency_code?: string | null;
  on_sale: boolean;
  variant_titles: string[];
  tags: string[];
};

export type ChatbotCatalogProductDetail = ChatbotCatalogItem & {
  description?: string | null;
  option_titles: string[];
};

export type ChatbotMessagePart =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "product-list";
      products: ChatbotCatalogItem[];
    }
  | {
      type: "product-detail";
      product: ChatbotCatalogProductDetail;
    };

export type ChatbotProductContextOption = {
  title: string;
  value: string;
};

export type ChatbotProductContextVariant = {
  id: string;
  title: string;
  sku?: string | null;
  in_stock: boolean;
  inventory_quantity?: number | null;
  allow_backorder?: boolean;
  options: ChatbotProductContextOption[];
  price?: string | null;
  original_price?: string | null;
  currency_code?: string | null;
};

export type ChatbotProductContext = {
  product_id: string;
  title: string;
  handle: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  collection_title?: string | null;
  product_type?: string | null;
  tags: string[];
  option_titles: string[];
  price_label?: string | null;
  original_price_label?: string | null;
  currency_code?: string | null;
  selected_variant_id?: string | null;
  selected_variant_title?: string | null;
  selected_variant_sku?: string | null;
  selected_variant_options: ChatbotProductContextOption[];
  selected_variant_in_stock?: boolean;
  selected_variant_inventory_quantity?: number | null;
  variants: ChatbotProductContextVariant[];
};

export type ChatbotMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  parts?: ChatbotMessagePart[];
  sources?: ChatbotSource[];
  handoffMessage?: string;
  isStreaming?: boolean;
  statusText?: string;
};

type PriceShape = {
  calculated_amount?: number | null;
  original_amount?: number | null;
  currency_code?: string | null;
};

function getOptionTitleMap(product: HttpTypes.StoreProduct) {
  return new Map(
    (product.options ?? [])
      .filter((option): option is HttpTypes.StoreProductOption & { id: string } =>
        Boolean(option.id)
      )
      .map((option) => [option.id, option.title ?? option.id])
  );
}

function getVariantOptions(
  variant: HttpTypes.StoreProductVariant,
  optionTitleMap: Map<string, string>
): ChatbotProductContextOption[] {
  return (variant.options ?? [])
    .filter((option) => Boolean(option.option_id && option.value))
    .map((option) => ({
      title: optionTitleMap.get(option.option_id!) ?? option.option_id!,
      value: option.value!,
    }));
}

function getVariantPriceLabels(
  variant: HttpTypes.StoreProductVariant,
  locale: string,
  fallbackCurrencyCode?: string | null
) {
  const calculatedPrice = (variant.calculated_price ?? {}) as PriceShape;
  const currencyCode = calculatedPrice.currency_code ?? fallbackCurrencyCode ?? null;
  const price =
    typeof calculatedPrice.calculated_amount === "number" && currencyCode
      ? formatPrice(calculatedPrice.calculated_amount, currencyCode, locale)
      : null;
  const originalPrice =
    typeof calculatedPrice.original_amount === "number" && currencyCode
      ? formatPrice(calculatedPrice.original_amount, currencyCode, locale)
      : null;

  return {
    price,
    originalPrice,
    currencyCode,
  };
}

export function createChatbotMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createChatbotSessionId() {
  return `session-${createChatbotMessageId()}`;
}

export function createWelcomeMessage(content: string): ChatbotMessage[] {
  return [
    {
      id: createChatbotMessageId(),
      role: "assistant",
      content,
    },
  ];
}

export function buildChatbotProductContext({
  product,
  locale,
  selectedVariantId,
  fallbackCurrencyCode,
}: {
  product: HttpTypes.StoreProduct;
  locale: string;
  selectedVariantId?: string;
  fallbackCurrencyCode?: string | null;
}): ChatbotProductContext {
  const optionTitleMap = getOptionTitleMap(product);
  const variants = (product.variants ?? []).map((variant) => {
    const priceLabels = getVariantPriceLabels(variant, locale, fallbackCurrencyCode);

    return {
      id: variant.id,
      title: variant.title ?? variant.sku ?? variant.id,
      sku: variant.sku ?? null,
      in_stock: isVariantInStock(variant),
      inventory_quantity: variant.inventory_quantity ?? null,
      allow_backorder: variant.allow_backorder ?? false,
      options: getVariantOptions(variant, optionTitleMap),
      price: priceLabels.price,
      original_price: priceLabels.originalPrice,
      currency_code: priceLabels.currencyCode,
    };
  });

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    (variants.length === 1 ? variants[0] : null);
  const selectedVariantSource = (product.variants ?? []).find(
    (variant) => variant.id === selectedVariant?.id
  );
  const selectedPriceLabels = selectedVariantSource
    ? getVariantPriceLabels(selectedVariantSource, locale, fallbackCurrencyCode)
    : {
        price: variants[0]?.price ?? null,
        originalPrice: variants[0]?.original_price ?? null,
        currencyCode: variants[0]?.currency_code ?? fallbackCurrencyCode ?? null,
      };

  return {
    product_id: product.id,
    title: product.title,
    handle: product.handle,
    subtitle: product.subtitle ?? null,
    description: product.description ?? null,
    thumbnail: product.thumbnail ?? null,
    collection_title: product.collection?.title ?? null,
    product_type: product.type?.value ?? null,
    tags: (product.tags ?? [])
      .map((tag) => tag.value ?? tag.id)
      .filter((value): value is string => Boolean(value)),
    option_titles: (product.options ?? [])
      .map((option) => option.title ?? option.id)
      .filter((value): value is string => Boolean(value)),
    price_label: selectedPriceLabels.price,
    original_price_label: selectedPriceLabels.originalPrice,
    currency_code: selectedPriceLabels.currencyCode,
    selected_variant_id: selectedVariant?.id ?? null,
    selected_variant_title: selectedVariant?.title ?? null,
    selected_variant_sku: selectedVariant?.sku ?? null,
    selected_variant_options: selectedVariant?.options ?? [],
    selected_variant_in_stock: selectedVariant?.in_stock,
    selected_variant_inventory_quantity:
      selectedVariant?.inventory_quantity ?? null,
    variants,
  };
}
