import type { HttpTypes } from "@medusajs/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ChatbotMessageContent } from "@/components/chatbot/chatbot-message-content";
import { ChatbotMessageParts } from "@/components/chatbot/chatbot-message-parts";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useRegion } from "@/context/region-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  buildChatbotProductContext,
  createChatbotMessageId,
  createChatbotSessionId,
  createWelcomeMessage,
  type ChatbotMessage,
  type ChatbotMessagePart,
  type ChatbotSettings,
  type ChatbotSource,
} from "@/lib/chatbot";
import { useI18n } from "@/lib/i18n/use-i18n";
import { sdk } from "@/lib/sdk";

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const conversationScopeRef = useRef<string | null>(null);
  const activeStreamAbortRef = useRef<(() => void) | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { locale, messages } = useI18n();
  const { selectedRegion, selectedCountryCode, loading: regionLoading } = useRegion();
  const { productId, variantId } = useLocalSearchParams<{
    productId?: string;
    variantId?: string;
  }>();

  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatbotMessage[]>([]);
  const [input, setInput] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStreamingResponse, setIsStreamingResponse] = useState(false);
  const [sessionId, setSessionId] = useState(() => createChatbotSessionId());
  const [activeProduct, setActiveProduct] = useState<HttpTypes.StoreProduct | null>(null);
  const [productContextLoading, setProductContextLoading] = useState(false);
  const [productContextError, setProductContextError] = useState<string | null>(null);

  const activeProductContext = useMemo(() => {
    if (!activeProduct) {
      return null;
    }

    return buildChatbotProductContext({
      product: activeProduct,
      locale,
      selectedVariantId: variantId,
      fallbackCurrencyCode: selectedRegion?.currency_code,
    });
  }, [activeProduct, locale, selectedRegion?.currency_code, variantId]);

  const conversationScope = activeProductContext?.handle
    ? `product:${activeProductContext.handle}`
    : "general";

  const resetConversation = useCallback(
    (nextSettings: ChatbotSettings | null = settings) => {
      if (!nextSettings) {
        return;
      }

      activeStreamAbortRef.current?.();
      activeStreamAbortRef.current = null;
      setChatMessages(createWelcomeMessage(nextSettings.welcome_message));
      setInput("");
      setError(null);
      setIsSubmitting(false);
      setIsStreamingResponse(false);
      setSessionId(createChatbotSessionId());
    },
    [settings]
  );

  useEffect(() => {
    return () => {
      activeStreamAbortRef.current?.();
      activeStreamAbortRef.current = null;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const response = await sdk.client.fetch<{ settings: ChatbotSettings }>(
          "/store/chatbot/settings",
          {
            method: "GET",
          }
        );

        if (!isMounted) {
          return;
        }

        setSettings(response.settings);
        setChatMessages(createWelcomeMessage(response.settings.welcome_message));
      } catch {
        if (isMounted) {
          setError(messages.chatbot.unavailable);
        }
      } finally {
        if (isMounted) {
          setHasLoaded(true);
        }
      }
    }

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, [messages.chatbot.unavailable]);

  useEffect(() => {
    let isMounted = true;

    async function loadProductContext() {
      if (!productId || !selectedRegion?.id) {
        setActiveProduct(null);
        setProductContextError(null);
        setProductContextLoading(false);
        return;
      }

      try {
        setProductContextLoading(true);
        setProductContextError(null);

        const { product } = await sdk.store.product.retrieve(productId, {
          region_id: selectedRegion.id,
          fields: "*variants.calculated_price,+variants.inventory_quantity",
        });

        if (isMounted) {
          setActiveProduct(product);
        }
      } catch {
        if (isMounted) {
          setActiveProduct(null);
          setProductContextError(messages.chatbot.productContextLoadFailed);
        }
      } finally {
        if (isMounted) {
          setProductContextLoading(false);
        }
      }
    }

    void loadProductContext();

    return () => {
      isMounted = false;
    };
  }, [messages.chatbot.productContextLoadFailed, productId, selectedRegion?.id]);

  useEffect(() => {
    if (!settings || !hasLoaded) {
      return;
    }

    const previousScope = conversationScopeRef.current;

    if (previousScope && previousScope !== conversationScope) {
      resetConversation(settings);
    }

    conversationScopeRef.current = conversationScope;
  }, [conversationScope, hasLoaded, resetConversation, settings]);

  useEffect(() => {
    if (!chatMessages.length) {
      return;
    }

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, [chatMessages]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: settings?.title || messages.chatbot.title,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => resetConversation()}
          disabled={!settings}
          style={styles.headerAction}
        >
          <Text style={[styles.headerActionText, { color: settings ? colors.tint : colors.icon }]}>
            {messages.chatbot.reset}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [
    colors.icon,
    colors.tint,
    messages.chatbot.reset,
    messages.chatbot.title,
    navigation,
    resetConversation,
    settings,
  ]);

  const sendMessage = useCallback(
    async (rawValue: string) => {
      const trimmedValue = rawValue.trim();

      if (!trimmedValue || !settings || isSubmitting || isStreamingResponse) {
        return;
      }

      const assistantMessageId = createChatbotMessageId();
      const requestMessages = [
        ...chatMessages,
        {
          id: createChatbotMessageId(),
          role: "user" as const,
          content: trimmedValue,
        },
      ].filter((message) => message.content.trim().length > 0);
      const nextMessages = [
        ...requestMessages,
        {
          id: assistantMessageId,
          role: "assistant" as const,
          content: "",
          isStreaming: true,
          statusText: messages.chatbot.thinking,
        },
      ];

      setChatMessages(nextMessages);
      setInput("");
      setError(null);
      setIsSubmitting(true);
      setIsStreamingResponse(true);

      try {
        const { stream, abort } = await sdk.client.fetchStream("/store/chatbot/message", {
          method: "POST",
          body: {
            session_id: sessionId,
            page_path: activeProductContext ? `/products/${activeProductContext.handle}` : "/chatbot",
            country_code: selectedCountryCode,
            language: locale,
            product_handle: activeProductContext?.handle,
            product_context: activeProductContext ?? undefined,
            messages: requestMessages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          },
        });

        activeStreamAbortRef.current = abort;

        if (!stream) {
          throw new Error("Chatbot stream was not established");
        }

        setIsSubmitting(false);

        let finalResponse:
          | {
              message: string;
              parts?: ChatbotMessagePart[];
              sources?: ChatbotSource[];
              handoff_message?: string;
            }
          | null = null;
        let streamedMessage = "";

        for await (const event of stream) {
          if (!event.data) {
            continue;
          }

          const payload = JSON.parse(event.data) as {
            delta?: string;
            label?: string;
            message?: string;
            parts?: ChatbotMessagePart[];
            sources?: ChatbotSource[];
            handoff_message?: string;
          };

          if (event.event === "chunk" && payload.delta) {
            streamedMessage = `${streamedMessage}${payload.delta}`;
            setChatMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantMessageId
                  ? {
                      ...message,
                      content: `${message.content}${payload.delta ?? ""}`,
                      isStreaming: true,
                      statusText: undefined,
                    }
                  : message
              )
            );
            continue;
          }

          if (event.event === "status") {
            setChatMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantMessageId
                  ? {
                      ...message,
                      statusText: payload.label || messages.chatbot.thinking,
                    }
                  : message
              )
            );
            continue;
          }

          if (event.event === "done" || event.event === "error") {
            finalResponse = {
              message: payload.message || streamedMessage || settings.fallback_message,
              parts: payload.parts,
              sources: payload.sources,
              handoff_message: payload.handoff_message,
            };
            activeStreamAbortRef.current = null;
            setIsSubmitting(false);
            setIsStreamingResponse(false);
            break;
          }
        }

        if (!finalResponse) {
          if (streamedMessage.trim()) {
            finalResponse = {
              message: streamedMessage,
              parts: [
                {
                  type: "text",
                  text: streamedMessage,
                },
              ],
            };
          } else {
            throw new Error("Chatbot stream ended without a final payload");
          }
        }

        setChatMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: finalResponse?.message || message.content,
                  parts: finalResponse?.parts,
                  sources: finalResponse?.sources,
                  handoffMessage: finalResponse?.handoff_message,
                  isStreaming: false,
                  statusText: undefined,
                }
              : message
          )
        );
      } catch (streamError) {
        if (streamError instanceof Error && streamError.name === "AbortError") {
          return;
        }

        setError(settings.fallback_message || messages.chatbot.unavailable);
        setChatMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: settings.fallback_message || messages.chatbot.unavailable,
                  sources: [{ type: "fallback", label: messages.chatbot.streamError }],
                  handoffMessage: settings.handoff_message,
                  isStreaming: false,
                  statusText: undefined,
                }
              : message
          )
        );
      } finally {
        activeStreamAbortRef.current = null;
        setIsSubmitting(false);
        setIsStreamingResponse(false);
      }
    },
    [
      activeProductContext,
      chatMessages,
      isStreamingResponse,
      isSubmitting,
      locale,
      messages.chatbot.streamError,
      messages.chatbot.thinking,
      messages.chatbot.unavailable,
      selectedCountryCode,
      sessionId,
      settings,
    ]
  );

  if (regionLoading || !hasLoaded) {
    return <Loading message={messages.common.loading} />;
  }

  if (!settings?.is_enabled) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
          {messages.chatbot.title}
        </Text>
        <Text style={[styles.emptyStateBody, { color: colors.icon }]}>
          {error || messages.chatbot.unavailable}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 92 : 0}
    >
      <View style={styles.content}>
        {activeProductContext || productContextLoading || productContextError ? (
          <View
            style={[
              styles.contextCard,
              {
                borderColor: `${colors.icon}20`,
                backgroundColor: `${colors.icon}08`,
              },
            ]}
          >
            <Text style={[styles.contextLabel, { color: colors.icon }]}>
              {activeProductContext
                ? messages.chatbot.productContext
                : messages.chatbot.generalContext}
            </Text>

            {productContextLoading ? (
              <View style={styles.contextLoadingRow}>
                <ActivityIndicator size="small" color={colors.tint} />
                <Text style={[styles.contextLoadingText, { color: colors.icon }]}>
                  {messages.common.loading}
                </Text>
              </View>
            ) : activeProductContext ? (
              <>
                <Text style={[styles.contextTitle, { color: colors.text }]}>
                  {activeProductContext.title}
                </Text>
                <View style={styles.contextMetaRow}>
                  {activeProductContext.selected_variant_title ? (
                    <View
                      style={[
                        styles.contextChip,
                        {
                          borderColor: `${colors.icon}24`,
                          backgroundColor: colors.background,
                        },
                      ]}
                    >
                      <Text style={[styles.contextChipText, { color: colors.icon }]}>
                        {messages.chatbot.selectedVariant}:{" "}
                        {activeProductContext.selected_variant_title}
                      </Text>
                    </View>
                  ) : null}
                  {activeProductContext.price_label ? (
                    <View
                      style={[
                        styles.contextChip,
                        {
                          borderColor: `${colors.icon}24`,
                          backgroundColor: colors.background,
                        },
                      ]}
                    >
                      <Text style={[styles.contextChipText, { color: colors.icon }]}>
                        {messages.chatbot.price}: {activeProductContext.price_label}
                      </Text>
                    </View>
                  ) : null}
                  {typeof activeProductContext.selected_variant_in_stock === "boolean" ? (
                    <View
                      style={[
                        styles.contextChip,
                        {
                          borderColor: `${colors.icon}24`,
                          backgroundColor: colors.background,
                        },
                      ]}
                    >
                      <Text style={[styles.contextChipText, { color: colors.icon }]}>
                        {messages.chatbot.availability}:{" "}
                        {activeProductContext.selected_variant_in_stock
                          ? messages.chatbot.inStock
                          : messages.chatbot.outOfStock}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </>
            ) : (
              <Text style={[styles.contextError, { color: colors.error }]}>
                {productContextError}
              </Text>
            )}
          </View>
        ) : null}

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {chatMessages.map((message) => {
            const isAssistant = message.role === "assistant";

            return (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  isAssistant ? styles.messageRowLeft : styles.messageRowRight,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isAssistant
                      ? {
                          borderColor: `${colors.icon}20`,
                          backgroundColor: `${colors.icon}08`,
                        }
                      : {
                          borderColor: colors.tint,
                          backgroundColor: colors.tint,
                        },
                  ]}
                >
                  {isAssistant && message.isStreaming ? (
                    <Text style={[styles.messageText, { color: colors.text }]}>
                      {message.content || message.statusText || messages.chatbot.thinking}
                    </Text>
                  ) : isAssistant ? (
                    message.parts && message.parts.length > 0 ? (
                      <ChatbotMessageParts parts={message.parts} />
                    ) : (
                      <ChatbotMessageContent content={message.content} />
                    )
                  ) : (
                    <Text style={[styles.messageText, styles.userMessageText]}>{message.content}</Text>
                  )}

                  {isAssistant && message.sources && message.sources.length > 0 ? (
                    <View style={styles.sourcesRow}>
                      {message.sources.map((source) => (
                        <View
                          key={`${message.id}-${source.type}-${source.label}`}
                          style={[
                            styles.sourceChip,
                            {
                              borderColor: `${colors.icon}20`,
                              backgroundColor: colors.background,
                            },
                          ]}
                        >
                          <Text style={[styles.sourceChipText, { color: colors.icon }]}>
                            {source.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {isAssistant && message.handoffMessage ? (
                    <Text style={[styles.handoffText, { color: colors.icon }]}>
                      {message.handoffMessage}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}

          {isSubmitting && !chatMessages.some((message) => message.isStreaming) ? (
            <View style={[styles.messageRow, styles.messageRowLeft]}>
              <View
                style={[
                  styles.messageBubble,
                  {
                    borderColor: `${colors.icon}20`,
                    backgroundColor: `${colors.icon}08`,
                  },
                ]}
              >
                <Text style={[styles.messageText, { color: colors.text }]}>
                  {messages.chatbot.thinking}
                </Text>
              </View>
            </View>
          ) : null}

          {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
        </ScrollView>

        {chatMessages.length <= 1 && settings.suggested_questions.length > 0 ? (
          <View
            style={[
              styles.suggestionsCard,
              {
                borderColor: `${colors.icon}20`,
              },
            ]}
          >
            <Text style={[styles.suggestionsLabel, { color: colors.icon }]}>
              {messages.chatbot.suggested}
            </Text>
            <View style={styles.suggestionsRow}>
              {settings.suggested_questions.map((question) => (
                <TouchableOpacity
                  key={question}
                  activeOpacity={0.85}
                  onPress={() => {
                    void sendMessage(question);
                  }}
                  style={[
                    styles.suggestionChip,
                    {
                      borderColor: `${colors.icon}20`,
                      backgroundColor: `${colors.icon}08`,
                    },
                  ]}
                >
                  <Text style={[styles.suggestionChipText, { color: colors.text }]}>
                    {question}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <View
          style={[
            styles.composerCard,
            {
              borderColor: `${colors.icon}20`,
            },
          ]}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={settings.placeholder_text || messages.chatbot.placeholder}
            placeholderTextColor={colors.icon}
            multiline
            textAlignVertical="top"
            editable={!isSubmitting && !isStreamingResponse}
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: `${colors.icon}20`,
                backgroundColor: colors.background,
              },
            ]}
          />

          <View style={styles.composerFooter}>
            <Text style={[styles.composerMeta, { color: colors.icon }]}>
              {selectedCountryCode?.toUpperCase() || selectedRegion?.currency_code?.toUpperCase()}
            </Text>
            <Button
              title={messages.chatbot.send}
              onPress={() => {
                void sendMessage(input);
              }}
              loading={isSubmitting}
              disabled={isSubmitting || isStreamingResponse || !input.trim()}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  headerAction: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  emptyStateBody: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },
  contextCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  contextLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  contextTitle: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  contextMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contextChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  contextChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  contextLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contextLoadingText: {
    fontSize: 14,
  },
  contextError: {
    fontSize: 14,
    lineHeight: 22,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    gap: 12,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: "row",
  },
  messageRowLeft: {
    justifyContent: "flex-start",
  },
  messageRowRight: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "88%",
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  sourcesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sourceChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sourceChipText: {
    fontSize: 11,
    fontWeight: "500",
  },
  handoffText: {
    fontSize: 12,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 22,
  },
  suggestionsCard: {
    borderTopWidth: 1,
    paddingTop: 4,
    gap: 10,
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionChipText: {
    fontSize: 13,
    lineHeight: 18,
  },
  composerCard: {
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 12,
  },
  input: {
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    lineHeight: 22,
  },
  composerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  composerMeta: {
    fontSize: 12,
    fontWeight: "500",
  },
});
