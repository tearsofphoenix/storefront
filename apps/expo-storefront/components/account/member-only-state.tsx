import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useCustomer } from "@/context/customer-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  GOOGLE_AUTH_ERROR,
  getGoogleRedirectUrl,
  resolveAccountAuthErrorMessage,
} from "@/lib/account-auth";
import { useI18n } from "@/lib/i18n/use-i18n";

type MemberOnlyStateProps = {
  title?: string;
  description?: string;
};

export function MemberOnlyState({
  title,
  description,
}: MemberOnlyStateProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { messages } = useI18n();
  const { authLoading, clearError, loginWithGoogle } = useCustomer();
  const [message, setMessage] = useState<string | null>(null);

  const resolvedError = useMemo(() => {
    return resolveAccountAuthErrorMessage(message, messages);
  }, [message, messages]);

  const handleGoogleLogin = async () => {
    clearError();
    setMessage(null);

    try {
      const authResult = await loginWithGoogle(getGoogleRedirectUrl());

      if (authResult === "completed") {
        router.replace("/(drawer)/(tabs)/(account)");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : GOOGLE_AUTH_ERROR);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {title || messages.account.guestTitle}
      </Text>
      <Text style={[styles.description, { color: colors.icon }]}>
        {description || messages.account.guestDescription}
      </Text>
      <Button
        title={messages.account.signIn}
        onPress={() => router.push("/(drawer)/(tabs)/(account)/login")}
        style={styles.primaryButton}
        disabled={authLoading}
      />
      <Button
        title={messages.account.createAccount}
        variant="secondary"
        onPress={() => router.push("/(drawer)/(tabs)/(account)/register")}
        disabled={authLoading}
      />
      <View style={styles.separatorRow}>
        <View style={[styles.separatorLine, { backgroundColor: `${colors.icon}30` }]} />
        <Text style={[styles.separatorText, { color: colors.icon }]}>
          {messages.common.or}
        </Text>
        <View style={[styles.separatorLine, { backgroundColor: `${colors.icon}30` }]} />
      </View>
      <Button
        title={
          authLoading
            ? messages.account.googleAuthRedirecting
            : messages.account.continueWithGoogle
        }
        variant="secondary"
        loading={authLoading}
        onPress={handleGoogleLogin}
        disabled={authLoading}
      />
      {resolvedError ? (
        <Text style={[styles.error, { color: colors.error }]}>{resolvedError}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 12,
  },
  separatorRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  error: {
    fontSize: 14,
    marginTop: 12,
  },
});
