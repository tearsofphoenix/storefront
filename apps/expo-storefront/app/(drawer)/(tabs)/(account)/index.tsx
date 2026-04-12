import type { HttpTypes } from "@medusajs/types";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MemberOnlyState } from "@/components/account/member-only-state";
import { Loading } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useCustomer } from '@/context/customer-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getDefaultShippingAddress, formatAddressLines, formatOrderDate } from '@/lib/account';
import { formatPrice } from '@/lib/format-price';
import { useI18n } from '@/lib/i18n/use-i18n';

export default function AccountScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const {
    customer,
    addresses,
    isAuthenticated,
    loading,
    authLoading,
    logout,
    listOrders,
  } = useCustomer();
  const { locale, messages } = useI18n();
  const [recentOrders, setRecentOrders] = useState<HttpTypes.StoreOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const orderCount = customer?.orders?.length || 0;
  const defaultShippingAddress = useMemo(() => {
    return getDefaultShippingAddress(addresses);
  }, [addresses]);

  const handleLogout = async () => {
    await logout();
    Alert.alert(messages.account.title, messages.account.signOutSuccess);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setRecentOrders([]);
      return;
    }

    setOrdersLoading(true);
    listOrders({ limit: 3 })
      .then((orders) => {
        setRecentOrders(orders);
      })
      .catch(() => {
        setRecentOrders([]);
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  }, [isAuthenticated, listOrders]);

  if (loading) {
    return <Loading message={messages.account.loadingAccount} />;
  }

  if (!isAuthenticated || !customer) {
    return <MemberOnlyState />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {messages.account.overview}
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {[customer.first_name, customer.last_name].filter(Boolean).join(" ") || messages.common.guest}
          </Text>
          <Text style={[styles.caption, { color: colors.icon }]}>
            {messages.account.signedInAs}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>{customer.email}</Text>
          {customer.phone ? (
            <Text style={[styles.value, { color: colors.text }]}>{customer.phone}</Text>
          ) : null}
        </View>

        <View style={styles.metricsRow}>
          <TouchableOpacity
            style={[styles.metricCard, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}
            onPress={() => router.push("/(drawer)/(tabs)/(account)/orders")}
          >
            <Text style={[styles.metricValue, { color: colors.text }]}>{orderCount}</Text>
            <Text style={[styles.metricLabel, { color: colors.icon }]}>
              {messages.account.recentOrders}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.metricCard, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}
            onPress={() => router.push("/(drawer)/(tabs)/(account)/addresses")}
          >
            <Text style={[styles.metricValue, { color: colors.text }]}>{addresses.length}</Text>
            <Text style={[styles.metricLabel, { color: colors.icon }]}>
              {messages.account.savedAddresses}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {messages.account.personalDetails}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {customer.email}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {customer.phone || messages.common.notAvailable}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {messages.account.defaultShipping}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(drawer)/(tabs)/(account)/addresses")}>
              <Text style={[styles.linkText, { color: colors.tint }]}>
                {messages.account.manageAddresses}
              </Text>
            </TouchableOpacity>
          </View>

          {defaultShippingAddress ? (
            <>
              <Text style={[styles.addressTitle, { color: colors.text }]}>
                {messages.account.defaultShippingAddress}
              </Text>
              {formatAddressLines(defaultShippingAddress).map((line) => (
                <Text key={line} style={[styles.value, { color: colors.text }]}>
                  {line}
                </Text>
              ))}
            </>
          ) : (
            <Text style={[styles.value, { color: colors.icon }]}>
              {messages.account.noAddresses}
            </Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {messages.account.orders}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(drawer)/(tabs)/(account)/orders")}>
              <Text style={[styles.linkText, { color: colors.tint }]}>
                {messages.account.viewAllOrders}
              </Text>
            </TouchableOpacity>
          </View>

          {ordersLoading ? (
            <Text style={[styles.value, { color: colors.icon }]}>
              {messages.order.loadingList}
            </Text>
          ) : recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={[styles.orderCard, { borderColor: `${colors.icon}20` }]}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/(account)/orders/[id]",
                    params: { id: order.id },
                  })
                }
              >
                <View style={styles.orderRow}>
                  <Text style={[styles.orderLabel, { color: colors.text }]}>
                    #{order.display_id || order.id}
                  </Text>
                  <Text style={[styles.orderTotal, { color: colors.text }]}>
                    {formatPrice(order.total, order.currency_code, locale)}
                  </Text>
                </View>
                <Text style={[styles.orderMeta, { color: colors.icon }]}>
                  {formatOrderDate(order.created_at, locale)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <>
              <Text style={[styles.value, { color: colors.icon }]}>
                {messages.account.noOrders}
              </Text>
              <Button
                title={messages.common.browseProducts}
                variant="secondary"
                onPress={() => router.push("/(drawer)/(tabs)/(home)")}
                style={styles.inlineButton}
              />
            </>
          )}
        </View>

        <Button
          title={messages.common.signOut}
          variant="secondary"
          loading={authLoading}
          onPress={handleLogout}
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
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  caption: {
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  orderCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  orderLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: "700",
  },
  orderMeta: {
    fontSize: 13,
  },
  inlineButton: {
    marginTop: 12,
  },
});
