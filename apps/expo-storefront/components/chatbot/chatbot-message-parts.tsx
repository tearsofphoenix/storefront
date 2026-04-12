import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useRegion } from "@/context/region-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { sdk } from "@/lib/sdk";
import type {
  ChatbotCatalogItem,
  ChatbotCatalogProductDetail,
  ChatbotMessagePart,
} from "@/lib/chatbot";
import { useI18n } from "@/lib/i18n/use-i18n";

import { ChatbotMessageContent } from "./chatbot-message-content";

type ChatbotMessagePartsProps = {
  parts: ChatbotMessagePart[];
};

function truncateText(value: string, maxLength = 220) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function ProductMetaTag({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (!value) {
    return null;
  }

  return (
    <View
      style={[
        styles.metaTag,
        {
          borderColor: `${colors.icon}25`,
          backgroundColor: `${colors.icon}10`,
        },
      ]}
    >
      <Text style={[styles.metaTagText, { color: colors.icon }]}>
        {label}: {value}
      </Text>
    </View>
  );
}

function ProductPrice({
  price,
  originalPrice,
}: {
  price?: string | null;
  originalPrice?: string | null;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (!price && !originalPrice) {
    return null;
  }

  return (
    <View style={styles.priceRow}>
      {originalPrice && originalPrice !== price ? (
        <Text style={[styles.originalPrice, { color: colors.icon }]}>
          {originalPrice}
        </Text>
      ) : null}
      {price ? <Text style={[styles.price, { color: colors.text }]}>{price}</Text> : null}
    </View>
  );
}

function useResolvedProductId(handle: string) {
  const { selectedRegion } = useRegion();
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function resolveProduct() {
      if (!handle || !selectedRegion?.id) {
        return;
      }

      try {
        setLoading(true);

        const { products } = await sdk.store.product.list({
          handle,
          region_id: selectedRegion.id,
          fields: "id,title",
          limit: 1,
        });

        if (isMounted) {
          setProductId(products[0]?.id ?? null);
        }
      } catch {
        if (isMounted) {
          setProductId(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void resolveProduct();

    return () => {
      isMounted = false;
    };
  }, [handle, selectedRegion?.id]);

  return {
    productId,
    loading,
  };
}

function ProductLinkCard({
  product,
  labels,
}: {
  product: ChatbotCatalogItem;
  labels: {
    viewProduct: string;
    collection: string;
    type: string;
    sale: string;
  };
}) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { productId, loading } = useResolvedProductId(product.handle);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={!productId}
      onPress={() =>
        router.push({
          pathname: "/(drawer)/(tabs)/(home)/product/[id]",
          params: {
            id: productId!,
            title: product.title,
          },
        })
      }
      style={[
        styles.card,
        {
          borderColor: `${colors.icon}22`,
          backgroundColor: colors.background,
          opacity: !productId && !loading ? 0.72 : 1,
        },
      ]}
    >
      <View style={styles.cardRow}>
        <Image
          source={product.thumbnail ? { uri: product.thumbnail } : undefined}
          style={[styles.thumbnail, { backgroundColor: colors.imagePlaceholder }]}
          contentFit="cover"
        />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleWrap}>
              <Text numberOfLines={1} style={[styles.cardTitle, { color: colors.text }]}>
                {product.title}
              </Text>
              {product.subtitle ? (
                <Text style={[styles.cardSubtitle, { color: colors.icon }]} numberOfLines={2}>
                  {product.subtitle}
                </Text>
              ) : null}
            </View>
            {product.on_sale ? (
              <View style={[styles.saleBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.saleBadgeText}>{labels.sale}</Text>
              </View>
            ) : null}
          </View>

          <ProductPrice price={product.price} originalPrice={product.original_price} />

          <View style={styles.metaRow}>
            <ProductMetaTag label={labels.collection} value={product.collection_title} />
            <ProductMetaTag label={labels.type} value={product.product_type} />
          </View>

          {product.variant_titles.length > 0 ? (
            <Text style={[styles.cardVariants, { color: colors.icon }]} numberOfLines={1}>
              {product.variant_titles.slice(0, 2).join(" • ")}
            </Text>
          ) : null}

          <View style={styles.cardFooter}>
            <Text style={[styles.viewProductText, { color: colors.tint }]}>
              {labels.viewProduct}
            </Text>
            {loading ? <ActivityIndicator size="small" color={colors.tint} /> : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ProductDetailCard({
  product,
  labels,
}: {
  product: ChatbotCatalogProductDetail;
  labels: {
    productDetails: string;
    viewProduct: string;
    collection: string;
    type: string;
    options: string;
    variants: string;
  };
}) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { productId, loading } = useResolvedProductId(product.handle);
  const optionSummary = useMemo(() => product.option_titles.slice(0, 6), [product.option_titles]);
  const variantSummary = useMemo(() => product.variant_titles.slice(0, 6), [product.variant_titles]);

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: `${colors.icon}22`,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.sectionLabel, { color: colors.icon }]}>{labels.productDetails}</Text>

      <View style={[styles.cardRow, styles.detailRow]}>
        <Image
          source={product.thumbnail ? { uri: product.thumbnail } : undefined}
          style={[styles.detailThumbnail, { backgroundColor: colors.imagePlaceholder }]}
          contentFit="cover"
        />
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{product.title}</Text>
          {product.subtitle ? (
            <Text style={[styles.cardSubtitle, { color: colors.icon }]}>{product.subtitle}</Text>
          ) : null}
          <ProductPrice price={product.price} originalPrice={product.original_price} />
          <View style={styles.metaRow}>
            <ProductMetaTag label={labels.collection} value={product.collection_title} />
            <ProductMetaTag label={labels.type} value={product.product_type} />
          </View>
        </View>
      </View>

      {product.description ? (
        <Text style={[styles.detailDescription, { color: colors.icon }]}>
          {truncateText(product.description)}
        </Text>
      ) : null}

      {optionSummary.length > 0 ? (
        <View style={styles.detailSection}>
          <Text style={[styles.detailSectionTitle, { color: colors.icon }]}>
            {labels.options}
          </Text>
          <View style={styles.metaRow}>
            {optionSummary.map((optionTitle) => (
              <ProductMetaTag key={`${product.id}-option-${optionTitle}`} label={labels.options} value={optionTitle} />
            ))}
          </View>
        </View>
      ) : null}

      {variantSummary.length > 0 ? (
        <View style={styles.detailSection}>
          <Text style={[styles.detailSectionTitle, { color: colors.icon }]}>
            {labels.variants}
          </Text>
          <View style={styles.metaRow}>
            {variantSummary.map((variantTitle) => (
              <ProductMetaTag
                key={`${product.id}-variant-${variantTitle}`}
                label={labels.variants}
                value={variantTitle}
              />
            ))}
          </View>
        </View>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!productId}
        onPress={() =>
          router.push({
            pathname: "/(drawer)/(tabs)/(home)/product/[id]",
            params: {
              id: productId!,
              title: product.title,
            },
          })
        }
        style={[
          styles.detailAction,
          {
            borderColor: `${colors.icon}22`,
            backgroundColor: `${colors.icon}08`,
            opacity: !productId && !loading ? 0.72 : 1,
          },
        ]}
      >
        <Text style={[styles.viewProductText, { color: colors.tint }]}>
          {labels.viewProduct}
        </Text>
        {loading ? <ActivityIndicator size="small" color={colors.tint} /> : null}
      </TouchableOpacity>
    </View>
  );
}

export function ChatbotMessageParts({ parts }: ChatbotMessagePartsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { messages } = useI18n();

  if (!parts.length) {
    return null;
  }

  const labels = {
    matchingProducts: messages.chatbot.matchingProducts,
    productDetails: messages.chatbot.productDetails,
    viewProduct: messages.chatbot.viewProduct,
    collection: messages.chatbot.collection,
    type: messages.chatbot.type,
    options: messages.chatbot.options,
    variants: messages.chatbot.variants,
    sale: messages.chatbot.sale,
  };

  return (
    <View style={styles.partsContainer}>
      {parts.map((part, index) => {
        const key = `${part.type}-${index}`;

        if (part.type === "text") {
          return <ChatbotMessageContent key={key} content={part.text} />;
        }

        if (part.type === "product-list") {
          return (
            <View key={key} style={styles.listSection}>
              <Text style={[styles.sectionLabel, { color: colors.icon }]}>
                {labels.matchingProducts}
              </Text>
              <View style={styles.listSectionBody}>
                {part.products.map((product) => (
                  <ProductLinkCard key={product.id} product={product} labels={labels} />
                ))}
              </View>
            </View>
          );
        }

        return <ProductDetailCard key={key} product={part.product} labels={labels} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  partsContainer: {
    gap: 16,
  },
  listSection: {
    gap: 10,
  },
  listSectionBody: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  detailRow: {
    marginTop: 2,
  },
  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 14,
  },
  detailThumbnail: {
    width: 88,
    height: 88,
    borderRadius: 16,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardTitleWrap: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  saleBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  saleBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  priceRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  metaTagText: {
    fontSize: 11,
    fontWeight: "500",
  },
  cardVariants: {
    fontSize: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  viewProductText: {
    fontSize: 13,
    fontWeight: "700",
  },
  detailDescription: {
    fontSize: 13,
    lineHeight: 20,
  },
  detailSection: {
    gap: 8,
  },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  detailAction: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
