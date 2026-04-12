import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { MemberOnlyState } from "@/components/account/member-only-state";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useCustomer } from "@/context/customer-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { messages } = useI18n();
  const {
    customer,
    loading,
    isAuthenticated,
    updateCustomer,
    error,
    clearError,
  } = useCustomer();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!customer) {
      return;
    }

    setFirstName(customer.first_name || "");
    setLastName(customer.last_name || "");
    setPhone(customer.phone || "");
  }, [customer]);

  const resolvedError = useMemo(() => {
    const currentError = message || error;

    if (currentError === "Failed to update customer profile") {
      return messages.account.profileSaveFailed;
    }

    return currentError;
  }, [error, message, messages.account.profileSaveFailed]);

  if (loading) {
    return <Loading message={messages.account.loadingAccount} />;
  }

  if (!isAuthenticated || !customer) {
    return (
      <MemberOnlyState
        title={messages.account.profile}
        description={messages.account.profileDescription}
      />
    );
  }

  const handleSave = async () => {
    clearError();
    setMessage(null);
    setSubmitting(true);

    try {
      await updateCustomer({
        firstName,
        lastName,
        phone: phone.trim() || undefined,
      });

      Alert.alert(messages.account.profile, messages.account.profileSaved, [
        {
          text: messages.common.done,
          onPress: () => router.replace("/(drawer)/(tabs)/(account)"),
        },
      ]);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : messages.account.profileSaveFailed
      );
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
          {messages.account.profile}
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {messages.account.profileDescription}
        </Text>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.background,
              borderColor: `${colors.icon}30`,
            },
          ]}
        >
          <Text style={[styles.label, { color: colors.icon }]}>
            {messages.common.email}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {customer.email}
          </Text>
          <Text style={[styles.hint, { color: colors.icon }]}>
            {messages.account.emailReadOnlyDescription}
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.icon }]}>
            {messages.common.firstName}
          </Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: `${colors.icon}30` }]}
            placeholder={messages.common.firstName}
            placeholderTextColor={colors.icon}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.icon }]}>
            {messages.common.lastName}
          </Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: `${colors.icon}30` }]}
            placeholder={messages.common.lastName}
            placeholderTextColor={colors.icon}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.icon }]}>
            {messages.common.phone}
          </Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: `${colors.icon}30` }]}
            placeholder={messages.common.phone}
            placeholderTextColor={colors.icon}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {resolvedError ? (
          <Text style={[styles.error, { color: colors.error }]}>{resolvedError}</Text>
        ) : null}

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
            disabled={!firstName || !lastName}
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
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
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
