import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ChatbotMessageContentProps = {
  content: string;
};

function isBulletLine(line: string) {
  return /^[-*]\s+/.test(line.trim());
}

function isHeadingLine(line: string) {
  return /^#{1,3}\s+/.test(line.trim());
}

export function ChatbotMessageContent({
  content,
}: ChatbotMessageContentProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trimEnd());

        if (lines.every(isBulletLine)) {
          return (
            <View key={`bullet-${index}`} style={styles.block}>
              {lines.map((line, lineIndex) => (
                <View key={`bullet-line-${lineIndex}`} style={styles.bulletRow}>
                  <Text style={[styles.bullet, { color: colors.text }]}>•</Text>
                  <Text style={[styles.body, { color: colors.text }]}>
                    {line.replace(/^[-*]\s+/, "")}
                  </Text>
                </View>
              ))}
            </View>
          );
        }

        if (lines.length === 1 && isHeadingLine(lines[0])) {
          return (
            <Text key={`heading-${index}`} style={[styles.heading, { color: colors.text }]}>
              {lines[0].replace(/^#{1,3}\s+/, "")}
            </Text>
          );
        }

        return (
          <Text key={`paragraph-${index}`} style={[styles.body, { color: colors.text }]}>
            {lines.join("\n")}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  block: {
    gap: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 16,
    lineHeight: 22,
  },
});
