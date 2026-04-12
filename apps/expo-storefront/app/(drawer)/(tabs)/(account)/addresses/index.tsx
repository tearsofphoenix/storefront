import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MemberOnlyState } from "@/components/account/member-only-state";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useCustomer } from "@/context/customer-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatAddressLines, getAddressTitle } from "@/lib/account";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function AddressesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { addresses, deleteAddress, isAuthenticated, loading } = useCustomer();
  const { messages } = useI18n();
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  const handleDelete = (addressId: string) => {
    Alert.alert(
      messages.account.deleteAddress,
      messages.account.deleteAddressDescription,
      [
        {
          text: messages.common.cancel,
          style: "cancel",
        },
        {
          text: messages.common.delete,
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingAddressId(addressId);
              await deleteAddress(addressId);
              Alert.alert(messages.account.addresses, messages.account.addressDeleted);
            } finally {
              setDeletingAddressId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <Loading message={messages.account.loadingAccount} />;
  }

  if (!isAuthenticated) {
    return (
      <MemberOnlyState
        title={messages.account.addressesTitle}
        description={messages.account.addressesDescription}
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Button
          title={messages.account.addAddress}
          onPress={() => router.push("/(drawer)/(tabs)/(account)/addresses/form")}
        />

        {!addresses.length ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {messages.account.noAddresses}
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.icon }]}>
              {messages.account.addressesEmptyDescription}
            </Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View
              key={address.id}
              style={[styles.card, { backgroundColor: colors.background, borderColor: `${colors.icon}30` }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeading}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {getAddressTitle(address) || messages.account.savedAddress}
                  </Text>
                  <View style={styles.badges}>
                    {address.is_default_shipping ? (
                      <View style={[styles.badge, { backgroundColor: `${colors.tint}18` }]}>
                        <Text style={[styles.badgeText, { color: colors.tint }]}>
                          {messages.account.defaultShipping}
                        </Text>
                      </View>
                    ) : null}
                    {address.is_default_billing ? (
                      <View style={[styles.badge, { backgroundColor: `${colors.tint}18` }]}>
                        <Text style={[styles.badgeText, { color: colors.tint }]}>
                          {messages.account.defaultBilling}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              {formatAddressLines(address).map((line) => (
                <Text key={`${address.id}-${line}`} style={[styles.addressLine, { color: colors.text }]}>
                  {line}
                </Text>
              ))}

              <View style={styles.actionsRow}>
                <Button
                  title={messages.common.edit}
                  variant="secondary"
                  style={styles.actionButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(drawer)/(tabs)/(account)/addresses/form",
                      params: { id: address.id },
                    })
                  }
                />
                <Button
                  title={messages.common.delete}
                  variant="secondary"
                  style={styles.actionButton}
                  loading={deletingAddressId === address.id}
                  onPress={() => handleDelete(address.id)}
                />
              </View>
            </View>
          ))
        )}
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
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardHeading: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  addressLine: {
    fontSize: 14,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
});
