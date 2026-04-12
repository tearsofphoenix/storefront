import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useCustomer } from '@/context/customer-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/lib/i18n/use-i18n';

function getGoogleRedirectUrl() {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return `${Constants.linkingUri}oauth/google`;
  }

  return Linking.createURL("oauth/google");
}

export default function LoginScreen() {
  const router = useRouter();
  const { auth_error: authError } = useLocalSearchParams<{ auth_error?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { messages } = useI18n();
  const { login, loginWithGoogle, authLoading, error, clearError } = useCustomer();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [activeAuthMethod, setActiveAuthMethod] = useState<"email" | "google" | null>(
    null
  );

  useEffect(() => {
    if (authError === "google") {
      setRouteError("GOOGLE_AUTH_ERROR");
    }
  }, [authError]);

  const resolvedError = useMemo(() => {
    const currentError = message || error || routeError;

    if (currentError === "AUTH_REQUIRES_ACTION") {
      return messages.account.authRequiresAction;
    }

    if (currentError === "GOOGLE_AUTH_UNAVAILABLE") {
      return messages.account.googleAuthUnavailable;
    }

    if (currentError === "GOOGLE_AUTH_CANCELLED") {
      return messages.account.googleAuthCancelled;
    }

    if (currentError === "GOOGLE_AUTH_ERROR") {
      return messages.account.googleAuthError;
    }

    return currentError;
  }, [
    error,
    message,
    messages.account.authRequiresAction,
    messages.account.googleAuthCancelled,
    messages.account.googleAuthError,
    messages.account.googleAuthUnavailable,
    routeError,
  ]);

  const handleLogin = async () => {
    clearError();
    setMessage(null);
    setRouteError(null);
    setActiveAuthMethod("email");

    try {
      await login(email, password);
      router.replace("/(drawer)/(tabs)/(account)");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : messages.common.tryAgain);
    } finally {
      setActiveAuthMethod(null);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setMessage(null);
    setRouteError(null);
    setActiveAuthMethod("google");

    try {
      const authResult = await loginWithGoogle(getGoogleRedirectUrl());

      if (authResult === "completed") {
        router.replace("/(drawer)/(tabs)/(account)");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "GOOGLE_AUTH_ERROR");
    } finally {
      setActiveAuthMethod(null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {messages.account.welcomeBack}
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {messages.account.signInSubtitle}
        </Text>

        <TextInput
          style={[styles.input, { color: colors.text, borderColor: `${colors.icon}30` }]}
          placeholder={messages.common.email}
          placeholderTextColor={colors.icon}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: `${colors.icon}30` }]}
          placeholder={messages.common.password}
          placeholderTextColor={colors.icon}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {resolvedError ? (
          <Text style={[styles.error, { color: colors.error }]}>{resolvedError}</Text>
        ) : null}

        <Button
          title={messages.account.signIn}
          loading={authLoading && activeAuthMethod === "email"}
          onPress={handleLogin}
          disabled={!email || !password || authLoading}
          style={styles.primaryButton}
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
            authLoading && activeAuthMethod === "google"
              ? messages.account.googleAuthRedirecting
              : messages.account.continueWithGoogle
          }
          variant="secondary"
          loading={authLoading && activeAuthMethod === "google"}
          onPress={handleGoogleLogin}
          disabled={authLoading}
        />

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.icon }]}>
            {messages.account.notMember}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(drawer)/(tabs)/(account)/register")}>
            <Text style={[styles.switchLink, { color: colors.tint }]}>
              {messages.account.joinUs}
            </Text>
          </TouchableOpacity>
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
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    fontSize: 14,
    marginBottom: 12,
  },
  primaryButton: {
    marginTop: 8,
  },
  separatorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  switchRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
