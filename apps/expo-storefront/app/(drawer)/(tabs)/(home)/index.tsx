import { Loading } from '@/components/loading';
import { ProductCard } from '@/components/product-card';
import { Colors } from '@/constants/theme';
import { useRegion } from '@/context/region-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/lib/i18n/use-i18n';
import { sdk } from '@/lib/sdk';
import {
  getStorefrontSiteName,
  setRuntimeStorefrontSiteName,
} from '@/lib/storefront-branding';
import type { HttpTypes } from '@medusajs/types';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

const DEFAULT_HOMEPAGE_COLLECTION_HANDLE = "homepage-featured";

type StorefrontInfoResponse = {
  store?: {
    name?: string | null;
  } | null;
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { selectedRegion } = useRegion();
  const { messages } = useI18n();
  const storefrontSiteName = getStorefrontSiteName();
  
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [featuredCollectionTitle, setFeaturedCollectionTitle] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const productFields = '*images,*variants.calculated_price,+variants.inventory_quantity';
      const storefrontInfoUrl = process.env.EXPO_PUBLIC_STOREFRONT_URL
        ? `${process.env.EXPO_PUBLIC_STOREFRONT_URL.replace(/\/+$/, "")}/api/storefront/info`
        : null;
      const [{ products: fetchedProducts }, featuredCollectionsResponse, storefrontInfo] =
        await Promise.all([
        sdk.store.product.list({
          region_id: selectedRegion?.id,
          fields: productFields,
        }),
        sdk.store.collection.list({
          handle: DEFAULT_HOMEPAGE_COLLECTION_HANDLE,
          fields: "id,handle,title",
          limit: 1,
        }),
          storefrontInfoUrl
            ? fetch(storefrontInfoUrl, {
                method: "GET",
                headers: {
                  accept: "application/json",
                },
              })
                .then(async (response) => {
                  if (!response.ok) {
                    return null;
                  }

                  return (await response.json()) as StorefrontInfoResponse;
                })
                .catch(() => null)
            : Promise.resolve(null),
        ]);

      let homepageCollection = featuredCollectionsResponse.collections[0] ?? null;

      if (!homepageCollection) {
        const fallbackCollectionsResponse = await sdk.store.collection.list({
          fields: "id,handle,title",
          limit: 1,
        });

        homepageCollection = fallbackCollectionsResponse.collections[0] ?? null;
      }

      let featuredProducts: HttpTypes.StoreProduct[] = [];

      if (homepageCollection?.id) {
        const featuredProductsResponse = await sdk.store.product.list({
          region_id: selectedRegion?.id,
          collection_id: homepageCollection.id,
          fields: productFields,
          limit: 4,
        });

        featuredProducts = featuredProductsResponse.products;
      }

      const featuredProduct = featuredProducts[0] ?? fetchedProducts[0] ?? null;
      setRuntimeStorefrontSiteName(storefrontInfo?.store?.name);

      setProducts(fetchedProducts);
      setFeaturedCollectionTitle(homepageCollection?.title || null);
      setBannerImageUrl(
        featuredProduct?.thumbnail ||
          featuredProduct?.images?.[0]?.url ||
          null
      );
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(messages.home.failedToLoadProducts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [messages.home.failedToLoadProducts, selectedRegion]);

  useEffect(() => {
    if (selectedRegion) {
      fetchHomeData();
    }
  }, [selectedRegion, fetchHomeData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  if (loading) {
    return <Loading message={messages.home.loadingProducts} />;
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={[styles.storeName, { color: colors.text }]}>
                {storefrontSiteName || messages.home.title}
              </Text>
              {featuredCollectionTitle ? (
                <Text style={[styles.featuredCollection, { color: colors.icon }]}>
                  {featuredCollectionTitle}
                </Text>
              ) : null}
            </View>
            <Image
              source={
                bannerImageUrl
                  ? { uri: bannerImageUrl }
                  : undefined
              }
              style={[styles.banner, { backgroundColor: colors.imagePlaceholder }]}
              contentFit="cover"
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {messages.home.latestProducts}
            </Text>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {messages.home.noProductsAvailable}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
  },
  headerCopy: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  storeName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  featuredCollection: {
    fontSize: 14,
    lineHeight: 20,
  },
  banner: {
    width: '100%',
    height: 200,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
