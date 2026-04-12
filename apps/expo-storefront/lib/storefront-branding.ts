import Constants from "expo-constants";

type PluginManifestEntry = {
  id?: string;
  config?: Record<string, unknown>;
};

type ThemeManifest = {
  theme?: {
    config?: Record<string, unknown>;
  } | null;
};

let runtimeStorefrontSiteName: string | null = null;

function readExpoExtra() {
  return (Constants.expoConfig?.extra || {}) as Record<string, unknown>;
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function parseJson<T>(value: unknown): T | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getSiteNameFromPluginManifest() {
  const extra = readExpoExtra();
  const parsed = parseJson<{ entries?: PluginManifestEntry[] } | PluginManifestEntry[]>(
    extra.MEDUSA_SAAS_PLUGIN_MANIFEST
  );

  const entries = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.entries)
    ? parsed.entries
    : [];
  const seoEntry = entries.find((entry) => entry.id === "seo");

  return readString(seoEntry?.config?.siteName);
}

function getBrandNameFromThemeManifest() {
  const extra = readExpoExtra();
  const parsed = parseJson<ThemeManifest>(extra.MEDUSA_SAAS_THEME_MANIFEST);

  return readString(parsed?.theme?.config?.brandName);
}

export function setRuntimeStorefrontSiteName(value: unknown) {
  runtimeStorefrontSiteName = readString(value);
}

export function getStorefrontSiteName() {
  const extra = readExpoExtra();

  return (
    runtimeStorefrontSiteName ||
    readString(extra.EXPO_PUBLIC_STOREFRONT_SITE_NAME) ||
    getSiteNameFromPluginManifest() ||
    getBrandNameFromThemeManifest()
  );
}
