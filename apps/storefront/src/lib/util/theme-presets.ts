export const STOREFRONT_THEME_COOKIE_KEY = "storefront_theme"

type StorefrontThemeTier = "first-wave" | "vertical-killer" | "deep-special"

export type StorefrontThemePreset = {
  key: StorefrontThemePresetKey
  slug: string
  name: string
  tier: StorefrontThemeTier
  summary: string
  primaryColor: string
  accentColor: string
  buttonFillColor: string
  buttonTextColor: string
  headingStyle: "sans" | "serif"
  headingFontFamily: string
  bodyFontFamily: string
  shellBackground: string
  navBackground: string
  footerBackground: string
}

const PRESET_DEFINITIONS = [
  {
    key: "dawn",
    slug: "dawn",
    name: "Dawn",
    tier: "first-wave",
    summary: "General-purpose fast B2C starter",
    primaryColor: "#2559f4",
    accentColor: "#f3efe7",
    buttonFillColor: "#2559f4",
    buttonTextColor: "#ffffff",
    headingStyle: "sans",
    headingFontFamily: 'reMarkableSans, Helvetica, Arial, sans-serif',
    bodyFontFamily: 'reMarkableSans, Helvetica, Arial, sans-serif',
    shellBackground: "#fcfbf8",
    navBackground: "rgba(252, 251, 248, 0.94)",
    footerBackground: "#f9f6f1",
  },
  {
    key: "prestige",
    slug: "prestige",
    name: "Prestige",
    tier: "first-wave",
    summary: "Fashion and luxury storytelling",
    primaryColor: "#1f4a3d",
    accentColor: "#efe4db",
    buttonFillColor: "#1f4a3d",
    buttonTextColor: "#ffffff",
    headingStyle: "serif",
    headingFontFamily: '"Iowan Old Style", "Times New Roman", serif',
    bodyFontFamily: 'reMarkableSans, Helvetica, Arial, sans-serif',
    shellBackground: "#fbf8f5",
    navBackground: "rgba(251, 248, 245, 0.94)",
    footerBackground: "#f4ede7",
  },
  {
    key: "impulse",
    slug: "impulse",
    name: "Impulse",
    tier: "first-wave",
    summary: "Promotion-first conversion engine",
    primaryColor: "#d9480f",
    accentColor: "#ffe3d5",
    buttonFillColor: "#d9480f",
    buttonTextColor: "#ffffff",
    headingStyle: "sans",
    headingFontFamily: '"Archivo", "Helvetica Neue", Arial, sans-serif',
    bodyFontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    shellBackground: "#fff8f5",
    navBackground: "rgba(255, 248, 245, 0.94)",
    footerBackground: "#ffece3",
  },
  {
    key: "warehouse",
    slug: "warehouse",
    name: "Warehouse",
    tier: "vertical-killer",
    summary: "Large catalog and mega navigation",
    primaryColor: "#0f4c81",
    accentColor: "#e6ecf5",
    buttonFillColor: "#0f4c81",
    buttonTextColor: "#ffffff",
    headingStyle: "sans",
    headingFontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    bodyFontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    shellBackground: "#f6f7f9",
    navBackground: "rgba(246, 247, 249, 0.95)",
    footerBackground: "#eef2f7",
  },
  {
    key: "motion",
    slug: "motion",
    name: "Motion",
    tier: "vertical-killer",
    summary: "Story-led content commerce",
    primaryColor: "#35663f",
    accentColor: "#dde4ce",
    buttonFillColor: "#35663f",
    buttonTextColor: "#ffffff",
    headingStyle: "serif",
    headingFontFamily: 'reMarkableSerif, "Book Antiqua", Georgia, serif',
    bodyFontFamily: 'reMarkableSans, Helvetica, Arial, sans-serif',
    shellBackground: "#f3f5ef",
    navBackground: "rgba(243, 245, 239, 0.95)",
    footerBackground: "#e8eddc",
  },
  {
    key: "minimal",
    slug: "minimal",
    name: "Minimal",
    tier: "vertical-killer",
    summary: "Minimal boutique and handcrafted goods",
    primaryColor: "#111827",
    accentColor: "#f3f4f6",
    buttonFillColor: "#111827",
    buttonTextColor: "#ffffff",
    headingStyle: "sans",
    headingFontFamily: 'reMarkableSans, Helvetica, Arial, sans-serif',
    bodyFontFamily: 'reMarkableSans, Helvetica, Arial, sans-serif',
    shellBackground: "#ffffff",
    navBackground: "rgba(255, 255, 255, 0.94)",
    footerBackground: "#fafafa",
  },
  {
    key: "food-restaurant",
    slug: "food-restaurant",
    name: "Food & Restaurant",
    tier: "deep-special",
    summary: "Ordering flow with booking-ready UX",
    primaryColor: "#c65d1a",
    accentColor: "#ffe0c1",
    buttonFillColor: "#c65d1a",
    buttonTextColor: "#ffffff",
    headingStyle: "sans",
    headingFontFamily: '"Avenir Next", "Segoe UI", Arial, sans-serif',
    bodyFontFamily: '"Avenir Next", "Segoe UI", Arial, sans-serif',
    shellBackground: "#fff7f0",
    navBackground: "rgba(255, 247, 240, 0.95)",
    footerBackground: "#ffecd9",
  },
  {
    key: "electronics-pro",
    slug: "electronics-pro",
    name: "Electronics Pro",
    tier: "deep-special",
    summary: "Tech catalog and B2C/B2B split pricing",
    primaryColor: "#1a66ff",
    accentColor: "#dfe8f3",
    buttonFillColor: "#1a66ff",
    buttonTextColor: "#ffffff",
    headingStyle: "sans",
    headingFontFamily: '"IBM Plex Sans", "Inter", Arial, sans-serif',
    bodyFontFamily: '"IBM Plex Sans", "Inter", Arial, sans-serif',
    shellBackground: "#f4f7fb",
    navBackground: "rgba(244, 247, 251, 0.95)",
    footerBackground: "#eaf0f8",
  },
  {
    key: "kids-family",
    slug: "kids-family",
    name: "Kids & Family",
    tier: "deep-special",
    summary: "Playful family-centered commerce",
    primaryColor: "#ff5ca8",
    accentColor: "#ffe6f7",
    buttonFillColor: "#ff5ca8",
    buttonTextColor: "#ffffff",
    headingStyle: "sans",
    headingFontFamily: '"Quicksand", "Trebuchet MS", Arial, sans-serif',
    bodyFontFamily: '"Quicksand", "Trebuchet MS", Arial, sans-serif',
    shellBackground: "#fff8fd",
    navBackground: "rgba(255, 248, 253, 0.95)",
    footerBackground: "#fff0fa",
  },
  {
    key: "home-living",
    slug: "home-living",
    name: "Home & Living",
    tier: "deep-special",
    summary: "Editorial interior and lifestyle catalog",
    primaryColor: "#7a5c3e",
    accentColor: "#e6ddd2",
    buttonFillColor: "#7a5c3e",
    buttonTextColor: "#ffffff",
    headingStyle: "serif",
    headingFontFamily: '"Lora", "Book Antiqua", Georgia, serif',
    bodyFontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
    shellBackground: "#f7f3ee",
    navBackground: "rgba(247, 243, 238, 0.95)",
    footerBackground: "#efe8de",
  },
] as const

export type StorefrontThemePresetKey = (typeof PRESET_DEFINITIONS)[number]["key"]

export const DEFAULT_STOREFRONT_THEME_KEY: StorefrontThemePresetKey = "dawn"

const PRESET_MAP = new Map<StorefrontThemePresetKey, StorefrontThemePreset>(
  PRESET_DEFINITIONS.map((preset) => [preset.key, preset])
)

const PRESET_ALIASES: Record<string, StorefrontThemePresetKey> = {
  dawn: "dawn",
  prestige: "prestige",
  impulse: "impulse",
  warehouse: "warehouse",
  motion: "motion",
  minimal: "minimal",
  food: "food-restaurant",
  restaurant: "food-restaurant",
  "food-restaurant": "food-restaurant",
  "food-and-restaurant": "food-restaurant",
  electronics: "electronics-pro",
  "electronics-pro": "electronics-pro",
  "electronicspro": "electronics-pro",
  kids: "kids-family",
  family: "kids-family",
  "kids-family": "kids-family",
  "kids-and-family": "kids-family",
  home: "home-living",
  living: "home-living",
  "home-living": "home-living",
  "home-and-living": "home-living",
}

export function listStorefrontThemePresets(): StorefrontThemePreset[] {
  return PRESET_DEFINITIONS.map((preset) => ({ ...preset }))
}

export function isStorefrontThemePresetKey(
  value: string | null | undefined
): value is StorefrontThemePresetKey {
  return Boolean(value && PRESET_MAP.has(value as StorefrontThemePresetKey))
}

export function resolveStorefrontThemePresetKey(
  input: string | null | undefined
): StorefrontThemePresetKey {
  if (!input) {
    return DEFAULT_STOREFRONT_THEME_KEY
  }

  const normalized = normalizeThemeToken(input)

  if (isStorefrontThemePresetKey(normalized)) {
    return normalized
  }

  if (normalized in PRESET_ALIASES) {
    return PRESET_ALIASES[normalized]
  }

  for (const preset of PRESET_DEFINITIONS) {
    if (
      normalized.includes(preset.key) ||
      normalized.includes(preset.slug) ||
      normalized.includes(normalizeThemeToken(preset.name))
    ) {
      return preset.key
    }
  }

  return DEFAULT_STOREFRONT_THEME_KEY
}

export function getStorefrontThemePreset(
  key: string | null | undefined
): StorefrontThemePreset {
  const resolvedKey = resolveStorefrontThemePresetKey(key)
  const preset = PRESET_MAP.get(resolvedKey)

  if (!preset) {
    return PRESET_MAP.get(DEFAULT_STOREFRONT_THEME_KEY)!
  }

  return { ...preset }
}

export function resolveThemePresetFromCandidates(
  ...values: Array<string | null | undefined>
): StorefrontThemePresetKey {
  for (const value of values) {
    if (!value) {
      continue
    }

    const normalized = normalizeThemeToken(value)

    if (normalized in PRESET_ALIASES || isStorefrontThemePresetKey(normalized)) {
      return resolveStorefrontThemePresetKey(normalized)
    }

    for (const preset of PRESET_DEFINITIONS) {
      if (
        normalized.includes(preset.key) ||
        normalized.includes(preset.slug) ||
        normalized.includes(normalizeThemeToken(preset.name))
      ) {
        return preset.key
      }
    }
  }

  return DEFAULT_STOREFRONT_THEME_KEY
}

function normalizeThemeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
}
