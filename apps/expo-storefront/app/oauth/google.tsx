import React, { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useCustomer } from "@/context/customer-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function GoogleAuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const hasHandledRef = useRef(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { messages } = useI18n();
  const { completeGoogleLogin } = useCustomer();

  useEffect(() => {
    if (hasHandledRef.current) {
      return;
    }

    hasHandledRef.current = true;

    const queryValues = Object.values(params);
    const hasAuthQuery = queryValues.some((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    );

    if (!hasAuthQuery) {
      router.replace("/(drawer)/(tabs)/(account)/login");
      return;
    }

    completeGoogleLogin(params as Record<string, string | string[] | undefined>)
      .then(() => {
        router.replace("/(drawer)/(tabs)/(account)");
      })
      .catch(() => {
        router.replace("/(drawer)/(tabs)/(account)/login?auth_error=google");
      });
  }, [completeGoogleLogin, params, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.tint} size="large" />
      <Text style={[styles.title, { color: colors.text }]}>
        {messages.account.googleAuthRedirecting}
      </Text>
      <Text style={[styles.description, { color: colors.icon }]}>
        {messages.common.loading}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
