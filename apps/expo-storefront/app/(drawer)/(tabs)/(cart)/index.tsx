import { CartItem } from '@/components/cart-item';
import { Loading } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/cart-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatPrice } from '@/lib/format-price';
import { useI18n } from '@/lib/i18n/use-i18n';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { cart, updateItemQuantity, removeItem, loading } = useCart();
  const { locale, messages } = useI18n();

  const isEmpty = !cart?.items || cart.items.length === 0;

  if (loading && !cart) {
    return <Loading message={messages.cart.loadingCart} />;
  }

  if (isEmpty) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          {messages.cart.emptyTitle}
        </Text>
        <Text style={[styles.emptyText, { color: colors.icon }]}>
          {messages.cart.emptyDescription}
        </Text>
        <Button
          title={messages.common.browseProducts}
          onPress={() => router.push('/')}
          style={styles.browseButton}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            currencyCode={cart.currency_code}
            onUpdateQuantity={(quantity) => updateItemQuantity(item.id, quantity)}
            onRemove={() => removeItem(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.icon + '30' }]}>
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              {messages.common.subtotal}
            </Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              {formatPrice(cart.item_subtotal, cart.currency_code, locale)}
            </Text>
          </View>
          {cart.tax_total !== undefined && cart.tax_total > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                {messages.common.tax}
              </Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                {formatPrice(cart.tax_total, cart.currency_code, locale)}
              </Text>
            </View>
          )}
          {cart.shipping_total !== undefined && cart.shipping_total > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                {messages.common.shipping}
              </Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                {formatPrice(cart.shipping_total, cart.currency_code, locale)}
              </Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.grandTotalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.grandTotalLabel, { color: colors.text }]}>
              {messages.common.total}
            </Text>
            <Text style={[styles.grandTotalValue, { color: colors.tint }]}>
              {formatPrice(cart.total, cart.currency_code, locale)}
            </Text>
          </View>
        </View>
        <Button
          title={messages.cart.proceedToCheckout}
          onPress={() => router.push("/checkout")}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    minWidth: 200,
  },
  listContent: {
    paddingBottom: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  totals: {
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});
