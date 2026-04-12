import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Linking from "expo-linking";

export const AUTH_REQUIRES_ACTION = "AUTH_REQUIRES_ACTION";
export const GOOGLE_AUTH_UNAVAILABLE = "GOOGLE_AUTH_UNAVAILABLE";
export const GOOGLE_AUTH_ERROR = "GOOGLE_AUTH_ERROR";
export const GOOGLE_AUTH_CANCELLED = "GOOGLE_AUTH_CANCELLED";

type AccountAuthMessageCatalog = {
  account: {
    authRequiresAction: string;
    googleAuthUnavailable: string;
    googleAuthCancelled: string;
    googleAuthError: string;
  };
};

const MOBILE_GOOGLE_CALLBACK_PATH = "/api/auth/mobile/google";

function normalizeBaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

export function getGoogleRedirectUrl() {
  const storefrontUrl = process.env.EXPO_PUBLIC_STOREFRONT_URL;

  if (storefrontUrl) {
    return `${normalizeBaseUrl(storefrontUrl)}${MOBILE_GOOGLE_CALLBACK_PATH}`;
  }

  return getGoogleReturnUrl();
}

export function getGoogleReturnUrl() {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return `${Constants.linkingUri}oauth/google`;
  }

  return Linking.createURL("oauth/google");
}

export function resolveAccountAuthErrorMessage(
  currentError: string | null | undefined,
  messages: AccountAuthMessageCatalog
) {
  if (!currentError) {
    return currentError;
  }

  if (currentError === AUTH_REQUIRES_ACTION) {
    return messages.account.authRequiresAction;
  }

  if (currentError === GOOGLE_AUTH_UNAVAILABLE) {
    return messages.account.googleAuthUnavailable;
  }

  if (currentError === GOOGLE_AUTH_CANCELLED) {
    return messages.account.googleAuthCancelled;
  }

  if (currentError === GOOGLE_AUTH_ERROR) {
    return messages.account.googleAuthError;
  }

  return currentError;
}
