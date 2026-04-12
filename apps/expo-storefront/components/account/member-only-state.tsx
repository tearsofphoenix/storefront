import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
      />
      <Button
        title={messages.account.createAccount}
        variant="secondary"
        onPress={() => router.push("/(drawer)/(tabs)/(account)/register")}
      />
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
});
