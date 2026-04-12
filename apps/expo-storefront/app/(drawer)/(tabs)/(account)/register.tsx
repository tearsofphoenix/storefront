import React, { useMemo, useState } from 'react';
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
import { useRouter } from 'expo-router';

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

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { messages } = useI18n();
  const { register, loginWithGoogle, authLoading, error, clearError } = useCustomer();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [activeAuthMethod, setActiveAuthMethod] = useState<"register" | "google" | null>(
    null
  );

  const resolvedError = useMemo(() => {
    const currentError = message || error;

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
  ]);

  const handleRegister = async () => {
    clearError();
    setMessage(null);
    setActiveAuthMethod("register");

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

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
          {messages.account.becomeMember}
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {messages.account.memberSubtitle}
        </Text>

        <TextInput
          style={[styles.input, { color: colors.text, borderColor: `${colors.icon}30` }]}
          placeholder={messages.common.firstName}
          placeholderTextColor={colors.icon}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: `${colors.icon}30` }]}
          placeholder={messages.common.lastName}
          placeholderTextColor={colors.icon}
          value={lastName}
          onChangeText={setLastName}
        />
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
          placeholder={messages.common.phone}
          placeholderTextColor={colors.icon}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: `${colors.icon}30` }]}
          placeholder={messages.common.password}
          placeholderTextColor={colors.icon}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={[styles.legal, { color: colors.icon }]}>
          {messages.account.byCreatingAccount} {messages.account.privacyPolicy} & {messages.account.termsOfUse}.
        </Text>

        {resolvedError ? (
          <Text style={[styles.error, { color: colors.error }]}>{resolvedError}</Text>
        ) : null}

        <Button
          title={messages.account.join}
          loading={authLoading && activeAuthMethod === "register"}
          onPress={handleRegister}
          disabled={!firstName || !lastName || !email || !password || authLoading}
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
            {messages.account.alreadyMember}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(drawer)/(tabs)/(account)/login")}>
            <Text style={[styles.switchLink, { color: colors.tint }]}>
              {messages.account.signIn}
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
  legal: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
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
