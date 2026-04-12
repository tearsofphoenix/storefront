import { Loading } from '@/components/loading';
import { ProductCard } from '@/components/product-card';
import { Colors } from '@/constants/theme';
import { useRegion } from '@/context/region-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/lib/i18n/use-i18n';
import { sdk } from '@/lib/sdk';
import type { HttpTypes } from '@medusajs/types';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { selectedRegion } = useRegion();
  const { messages } = useI18n();
  
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { products: fetchedProducts } = await sdk.store.product.list({
        region_id: selectedRegion?.id,
        fields: '*variants.calculated_price,+variants.inventory_quantity',
      });
      
      setProducts(fetchedProducts);
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
      fetchProducts();
    }
  }, [selectedRegion, fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
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
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800' }}
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
