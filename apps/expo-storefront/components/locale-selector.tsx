import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useI18n } from "@/lib/i18n/use-i18n";
import { localeLabels, supportedLocales } from "@/lib/i18n/shared";

interface LocaleSelectorProps {
  onLocaleChange?: () => void;
}

export function LocaleSelector({ onLocaleChange }: LocaleSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { locale, messages, setLocale } = useI18n();

  const handleSelectLocale = async (nextLocale: string) => {
    await setLocale(nextLocale);
    onLocaleChange?.();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {messages.common.selectLanguage}
      </Text>
      {supportedLocales.map((supportedLocale) => {
        const isSelected = locale === supportedLocale;

        return (
          <TouchableOpacity
            key={supportedLocale}
            style={[
              styles.localeItem,
              {
                backgroundColor: isSelected ? `${colors.tint}20` : "transparent",
                borderColor: `${colors.icon}30`,
              },
            ]}
            onPress={() => handleSelectLocale(supportedLocale)}
          >
            <View style={styles.localeInfo}>
              <Text
                style={[
                  styles.localeName,
                  {
                    color: isSelected ? colors.tint : colors.text,
                    fontWeight: isSelected ? "600" : "400",
                  },
                ]}
              >
                {localeLabels[supportedLocale]}
              </Text>
              <Text style={[styles.localeCode, { color: colors.icon }]}>
                {supportedLocale}
              </Text>
            </View>
            {isSelected && (
              <Text style={{ color: colors.tint, fontSize: 18 }}>✓</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  localeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  localeInfo: {
    flex: 1,
  },
  localeName: {
    fontSize: 16,
    marginBottom: 4,
  },
  localeCode: {
    fontSize: 12,
  },
});
