import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { MemberOnlyState } from "@/components/account/member-only-state";
import { AddressForm } from "@/components/checkout/address-form";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useCustomer } from "@/context/customer-context";
import { useRegion } from "@/context/region-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function AddressFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { selectedRegion } = useRegion();
  const {
    addresses,
    createAddress,
    updateAddress,
    isAuthenticated,
    loading,
    error,
    clearError,
  } = useCustomer();
  const { messages } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState(selectedRegion?.countries?.[0]?.iso_2 || "");
  const [phone, setPhone] = useState("");
  const [isDefaultShipping, setIsDefaultShipping] = useState(false);
  const [isDefaultBilling, setIsDefaultBilling] = useState(false);

  const editingAddress = useMemo(() => {
    return addresses.find((item) => item.id === params.id) ?? null;
  }, [addresses, params.id]);

  useEffect(() => {
    if (!editingAddress) {
      return;
    }

    setFirstName(editingAddress.first_name || "");
    setLastName(editingAddress.last_name || "");
    setAddress(editingAddress.address_1 || "");
    setCity(editingAddress.city || "");
    setPostalCode(editingAddress.postal_code || "");
    setCountryCode(editingAddress.country_code || selectedRegion?.countries?.[0]?.iso_2 || "");
    setPhone(editingAddress.phone || "");
    setIsDefaultShipping(Boolean(editingAddress.is_default_shipping));
    setIsDefaultBilling(Boolean(editingAddress.is_default_billing));
  }, [editingAddress, selectedRegion?.countries]);

  useEffect(() => {
    if (editingAddress || countryCode || !selectedRegion?.countries?.length) {
      return;
    }

    setCountryCode(selectedRegion.countries[0]?.iso_2 || "");
  }, [countryCode, editingAddress, selectedRegion?.countries]);

  if (loading) {
    return <Loading message={messages.account.loadingAccount} />;
  }

  if (!isAuthenticated) {
    return (
      <MemberOnlyState
        title={messages.account.addressFormTitle}
        description={messages.account.addressesDescription}
      />
    );
  }

  const handleSave = async () => {
    clearError();

    if (!firstName || !lastName || !address || !city || !postalCode || !countryCode) {
      Alert.alert(messages.account.addressFormTitle, messages.account.fillAddressFields);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        countryCode,
        phone,
        isDefaultShipping,
        isDefaultBilling,
      };

      if (editingAddress) {
        await updateAddress(editingAddress.id, payload);
      } else {
        await createAddress(payload);
      }

      Alert.alert(messages.account.addresses, messages.account.addressSaved);
      router.replace("/(drawer)/(tabs)/(account)/addresses");
    } catch (err) {
      const message = err instanceof Error ? err.message : error || messages.common.tryAgain;
      Alert.alert(messages.account.addressFormTitle, message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {editingAddress ? messages.account.editAddress : messages.account.addAddress}
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {messages.account.addressFormDescription}
        </Text>

        <AddressForm
          firstName={firstName}
          lastName={lastName}
          address={address}
          city={city}
          postalCode={postalCode}
          countryCode={countryCode}
          phone={phone}
          countries={selectedRegion?.countries || []}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onAddressChange={setAddress}
          onCityChange={setCity}
          onPostalCodeChange={setPostalCode}
          onCountryCodeChange={setCountryCode}
          onPhoneChange={setPhone}
        />

        <View style={[styles.switchCard, { borderColor: `${colors.icon}30` }]}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextGroup}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>
                {messages.account.defaultShipping}
              </Text>
              <Text style={[styles.switchDescription, { color: colors.icon }]}>
                {messages.account.defaultShippingDescription}
              </Text>
            </View>
            <Switch value={isDefaultShipping} onValueChange={setIsDefaultShipping} />
          </View>

          <View style={[styles.switchDivider, { backgroundColor: `${colors.icon}20` }]} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextGroup}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>
                {messages.account.defaultBilling}
              </Text>
              <Text style={[styles.switchDescription, { color: colors.icon }]}>
                {messages.account.defaultBillingDescription}
              </Text>
            </View>
            <Switch value={isDefaultBilling} onValueChange={setIsDefaultBilling} />
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Button
            title={messages.common.cancel}
            variant="secondary"
            style={styles.actionButton}
            onPress={() => router.back()}
          />
          <Button
            title={messages.common.save}
            style={styles.actionButton}
            loading={submitting}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  switchCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  switchTextGroup: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    lineHeight: 20,
  },
  switchDivider: {
    height: 1,
    marginVertical: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
  },
});
