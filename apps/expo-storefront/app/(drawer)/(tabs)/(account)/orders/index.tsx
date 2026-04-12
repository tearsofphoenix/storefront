import type { HttpTypes } from "@medusajs/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MemberOnlyState } from "@/components/account/member-only-state";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useCustomer } from "@/context/customer-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatOrderDate } from "@/lib/account";
import { formatPrice } from "@/lib/format-price";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function OrdersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isAuthenticated, loading, listOrders } = useCustomer();
  const { locale, messages, t } = useI18n();
  const [orders, setOrders] = useState<HttpTypes.StoreOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    listOrders({ limit: 20 })
      .then((nextOrders) => {
        setOrders(nextOrders);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  }, [isAuthenticated, listOrders]);

  if (loading || ordersLoading) {
    return <Loading message={messages.order.loadingList} />;
  }

  if (!isAuthenticated) {
    return (
      <MemberOnlyState
        title={messages.account.ordersTitle}
        description={messages.account.ordersDescription}
      />
    );
  }

  if (!orders.length) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {messages.account.noOrders}
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {messages.account.ordersEmptyDescription}
        </Text>
        <Button
          title={messages.common.browseProducts}
          onPress={() => router.replace("/(drawer)/(tabs)/(home)")}
        />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}
            onPress={() =>
              router.push({
                pathname: "/(drawer)/(tabs)/(account)/orders/[id]",
                params: { id: order.id },
              })
            }
          >
            <View style={styles.row}>
              <Text style={[styles.orderId, { color: colors.text }]}>
                #{order.display_id || order.id}
              </Text>
              <Text style={[styles.total, { color: colors.text }]}>
                {formatPrice(order.total, order.currency_code, locale)}
              </Text>
            </View>
            <Text style={[styles.meta, { color: colors.icon }]}>
              {formatOrderDate(order.created_at, locale)}
            </Text>
            <Text style={[styles.meta, { color: colors.icon }]}>
              {t(messages.account.itemsCount, { count: order.items?.length || 0 })}
            </Text>
          </TouchableOpacity>
        ))}
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
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
  },
  total: {
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
});
