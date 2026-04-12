import type { HttpTypes } from "@medusajs/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { MemberOnlyState } from "@/components/account/member-only-state";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useCustomer } from "@/context/customer-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatAddressLines, formatOrderDate } from "@/lib/account";
import { formatPrice } from "@/lib/format-price";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isAuthenticated, loading, retrieveOrder } = useCustomer();
  const { locale, messages, t } = useI18n();
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  useEffect(() => {
    if (!params.id || !isAuthenticated) {
      setOrder(null);
      setOrderLoading(false);
      return;
    }

    setOrderLoading(true);
    retrieveOrder(params.id)
      .then((nextOrder) => {
        setOrder(nextOrder);
      })
      .catch(() => {
        setOrder(null);
      })
      .finally(() => {
        setOrderLoading(false);
      });
  }, [isAuthenticated, params.id, retrieveOrder]);

  if (loading || orderLoading) {
    return <Loading message={messages.order.loading} />;
  }

  if (!isAuthenticated) {
    return (
      <MemberOnlyState
        title={messages.order.orderDetailsTitle}
        description={messages.account.ordersDescription}
      />
    );
  }

  if (!order) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {messages.order.notFound}
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {messages.order.detailMissingDescription}
        </Text>
        <Button
          title={messages.order.backToOrders}
          onPress={() => router.replace("/(drawer)/(tabs)/(account)/orders")}
        />
      </View>
    );
  }

  const shippingLines = formatAddressLines(order.shipping_address);
  const billingLines = formatAddressLines(order.billing_address);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            #{order.display_id || order.id}
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            {formatOrderDate(order.created_at, locale)}
          </Text>

          <View style={styles.metaList}>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.icon }]}>
                {messages.order.totalLabel}
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {formatPrice(order.total, order.currency_code, locale)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.icon }]}>
                {messages.order.emailLabel}
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {order.email || messages.common.notAvailable}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.icon }]}>
                {messages.order.statusLabel}
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {order.status || messages.common.notAvailable}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {messages.common.orderItems}
          </Text>
          {(order.items || []).map((item) => (
            <View
              key={item.id}
              style={[styles.itemRow, { borderBottomColor: `${colors.icon}20` }]}
            >
              <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>
                  {item.product?.title || item.title}
                </Text>
                {item.variant?.title ? (
                  <Text style={[styles.itemMeta, { color: colors.icon }]}>
                    {item.variant.title}
                  </Text>
                ) : null}
                <Text style={[styles.itemMeta, { color: colors.icon }]}>
                  {t(messages.order.qty, { count: item.quantity || 0 })}
                </Text>
              </View>
              <Text style={[styles.itemTotal, { color: colors.text }]}>
                {formatPrice(item.total, order.currency_code, locale)}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {messages.common.shippingAddress}
          </Text>
          {shippingLines.length ? (
            shippingLines.map((line) => (
              <Text key={line} style={[styles.addressLine, { color: colors.text }]}>
                {line}
              </Text>
            ))
          ) : (
            <Text style={[styles.addressLine, { color: colors.icon }]}>
              {messages.common.notAvailable}
            </Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {messages.common.billingAddress}
          </Text>
          {billingLines.length ? (
            billingLines.map((line) => (
              <Text key={line} style={[styles.addressLine, { color: colors.text }]}>
                {line}
              </Text>
            ))
          ) : (
            <Text style={[styles.addressLine, { color: colors.icon }]}>
              {messages.common.notAvailable}
            </Text>
          )}
        </View>

        <Button
          title={messages.order.backToOrders}
          variant="secondary"
          onPress={() => router.replace("/(drawer)/(tabs)/(account)/orders")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaList: {
    marginTop: 16,
    gap: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaLabel: {
    fontSize: 14,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "700",
  },
  addressLine: {
    fontSize: 14,
    lineHeight: 22,
  },
});
