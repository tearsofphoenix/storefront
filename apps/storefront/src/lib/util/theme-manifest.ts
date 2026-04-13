import {
  getStorefrontThemePreset,
  resolveThemePresetFromCandidates,
  type StorefrontThemePresetKey,
} from "./theme-presets"

type StorefrontThemeManifestEntry = {
  id: string
  slug: string
  name: string
  version: string
  capabilities: string[]
  config: Record<string, string | boolean>
  artifactUrl?: string | null
  artifactIntegrity?: string | null
  assets?: Record<string, unknown> | null
  assetUpdatedAt?: string | null
}

type StorefrontThemeManifestEnvelope = {
  version: string
  storeId: string
  generatedAt: string
  manifestHash: string
  activeThemeId: string | null
  theme: StorefrontThemeManifestEntry | null
}

export type StorefrontThemePresentation = {
  themePresetKey: StorefrontThemePresetKey
  themeId: string | null
  themeName: string
  brandName: string
  heroEyebrow: string
  announcement: string
  heroHeading: string
  heroSubheading: string
  heroFeatureBullets: string[]
  heroMetrics: Array<{ label: string; value: string }>
  secondaryCtaLabel: string | null
  secondaryCtaHref: string | null
  footerNote: string | null
  ctaLabel: string
  ctaHref: string
  primaryColor: string
  accentColor: string
  buttonFillColor: string
  buttonTextColor: string
  surfaceStyle: "soft" | "contrast" | "glass"
  heroStyle: "split" | "editorial" | "spotlight"
  cardStyle: "shadowed" | "minimal" | "outline"
  headingStyle: "sans" | "serif"
  headingFontFamily: string
  bodyFontFamily: string
  panelRadiusStyle: "soft" | "balanced" | "crisp"
  panelRadius: number
  shellBackground: string
  navBackground: string
  footerBackground: string
}

export function readStorefrontThemeManifest(): StorefrontThemeManifestEnvelope {
  const raw = process.env.MEDUSA_SAAS_THEME_MANIFEST

  if (!raw) {
    return createEmptyThemeManifest()
  }

  try {
    const parsed = JSON.parse(raw) as StorefrontThemeManifestEnvelope
    return {
      version:
        parsed.version ??
        process.env.MEDUSA_SAAS_THEME_MANIFEST_VERSION ??
        "legacy",
      storeId: parsed.storeId ?? "unknown",
      generatedAt: parsed.generatedAt ?? "",
      manifestHash:
        parsed.manifestHash ??
        process.env.MEDUSA_SAAS_THEME_MANIFEST_HASH ??
        "unknown",
      activeThemeId: parsed.activeThemeId ?? parsed.theme?.id ?? null,
      theme: parsed.theme ?? null,
    }
  } catch {
    return createThemeManifestFromToken(raw)
  }
}

export function getActiveStorefrontTheme(): StorefrontThemeManifestEntry | null {
  return readStorefrontThemeManifest().theme
}

export function getStorefrontThemePresentation(): StorefrontThemePresentation {
  const theme = getActiveStorefrontTheme()
  const config = theme?.config ?? {}
  const themePresetKey = resolveThemePresetFromCandidates(
    readStringValue(config.themePreset),
    readStringValue(config.themeSlug),
    theme?.slug,
    theme?.name,
    theme?.id
  )
  const themePreset = getStorefrontThemePreset(themePresetKey)
  const storefrontAssets = readRecord(theme?.assets?.storefront)
  const heroAssets = readRecord(storefrontAssets?.hero)
  const footerAssets = readRecord(storefrontAssets?.footer)
  const surfaceStyle = normalizeSelectValue(
    config.surfaceStyle,
    ["soft", "contrast", "glass"],
    "soft"
  )
  const heroStyle = normalizeSelectValue(
    config.heroStyle,
    ["split", "editorial", "spotlight"],
    "split"
  )
  const cardStyle = normalizeSelectValue(
    config.cardStyle,
    ["shadowed", "minimal", "outline"],
    "shadowed"
  )
  const headingStyle = normalizeSelectValue(
    config.headingStyle,
    ["sans", "serif"],
    themePreset.headingStyle
  )
  const panelRadiusStyle = normalizeSelectValue(
    config.panelRadius,
    ["soft", "balanced", "crisp"],
    "balanced"
  )
  const panelRadius =
    panelRadiusStyle === "crisp"
      ? 10
      : panelRadiusStyle === "balanced"
      ? 14
      : 18
  const defaultShellBackground = themePreset.shellBackground
  const defaultNavBackground = themePreset.navBackground
  const defaultFooterBackground = themePreset.footerBackground
  const primaryColor = readColor(config.primaryColor, themePreset.primaryColor)
  const accentColor = readColor(config.accentColor, themePreset.accentColor)
  const buttonFillColor = readColor(
    config.buttonFillColor,
    themePreset.buttonFillColor
  )
  const buttonTextColor = readColor(
    config.buttonTextColor,
    themePreset.buttonTextColor || getReadableTextColor(buttonFillColor)
  )

  return {
    themePresetKey,
    themeId: theme?.id ?? null,
    themeName: theme?.name ?? themePreset.name,
    brandName: readString(config.brandName, "Panda AI Store"),
    heroEyebrow:
      readStringValue(heroAssets?.eyebrow) ??
      `${theme?.name ?? themePreset.name} · storefront`,
    announcement: readString(config.announcement, ""),
    heroHeading: readString(
      config.heroHeading,
      "A cleaner storefront for curated essentials"
    ),
    heroSubheading: readString(
      config.heroSubheading,
      "Quiet surfaces, sharp hierarchy, and product-first layouts inspired by the Nuxt reference storefront."
    ),
    heroFeatureBullets: readStringArray(heroAssets?.featureBullets),
    heroMetrics: readMetricArray(heroAssets?.metrics) ?? [
      { label: "Theme", value: theme?.name ?? themePreset.name },
      { label: "Layout", value: "Split hero" },
      { label: "Grid", value: "4-column catalog" },
      { label: "Focus", value: "Product detail" },
    ],
    secondaryCtaLabel: readStringValue(heroAssets?.secondaryCtaLabel),
    secondaryCtaHref: readStringValue(heroAssets?.secondaryCtaHref),
    footerNote: readStringValue(footerAssets?.note),
    ctaLabel: readString(config.ctaLabel, "Browse products"),
    ctaHref: readString(config.ctaHref, "/store"),
    primaryColor,
    accentColor,
    buttonFillColor,
    buttonTextColor,
    surfaceStyle,
    heroStyle,
    cardStyle,
    headingStyle,
    headingFontFamily: readString(
      config.headingFontFamily,
      themePreset.headingFontFamily
    ),
    bodyFontFamily: readString(config.bodyFontFamily, themePreset.bodyFontFamily),
    panelRadiusStyle,
    panelRadius,
    shellBackground: readCssColor(config.shellBackground, defaultShellBackground),
    navBackground: readCssColor(config.navBackground, defaultNavBackground),
    footerBackground: readCssColor(
      config.footerBackground,
      defaultFooterBackground
    ),
  }
}

export function toRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "")
  const fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((segment) => `${segment}${segment}`)
          .join("")
      : normalized

  if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
    return `rgba(15, 118, 110, ${alpha})`
  }

  const int = Number.parseInt(fullHex, 16)
  const red = (int >> 16) & 255
  const green = (int >> 8) & 255
  const blue = int & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function createEmptyThemeManifest(): StorefrontThemeManifestEnvelope {
  return {
    version: process.env.MEDUSA_SAAS_THEME_MANIFEST_VERSION ?? "legacy",
    storeId: "unknown",
    generatedAt: "",
    manifestHash: process.env.MEDUSA_SAAS_THEME_MANIFEST_HASH ?? "unknown",
    activeThemeId: null,
    theme: null,
  }
}

function createThemeManifestFromToken(
  value: string
): StorefrontThemeManifestEnvelope {
  const normalizedValue = readStringValue(value)

  if (!normalizedValue) {
    return createEmptyThemeManifest()
  }

  return {
    version: process.env.MEDUSA_SAAS_THEME_MANIFEST_VERSION ?? "legacy",
    storeId: "unknown",
    generatedAt: "",
    manifestHash: process.env.MEDUSA_SAAS_THEME_MANIFEST_HASH ?? "unknown",
    activeThemeId: normalizedValue,
    theme: {
      id: normalizedValue,
      slug: normalizedValue,
      name: normalizedValue,
      version: "shorthand",
      capabilities: [],
      config: {
        themePreset: normalizedValue,
      },
    },
  }
}

function readString(
  value: string | boolean | undefined,
  fallback: string
): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback
}

function readStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (entry): entry is string =>
          typeof entry === "string" && entry.trim().length > 0
      )
    : []
}

function readMetricArray(
  value: unknown
): Array<{ label: string; value: string }> | null {
  if (!Array.isArray(value)) {
    return null
  }

  const metrics = value
    .map((entry) => readRecord(entry))
    .filter((entry): entry is Record<string, unknown> => Boolean(entry))
    .map((entry) => {
      const label = readStringValue(entry.label)
      const metricValue = readStringValue(entry.value)
      if (!label || !metricValue) {
        return null
      }

      return { label, value: metricValue }
    })
    .filter((entry): entry is { label: string; value: string } =>
      Boolean(entry)
    )

  return metrics.length > 0 ? metrics : null
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function readColor(
  value: string | boolean | undefined,
  fallback: string
): string {
  return typeof value === "string" &&
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
    ? value
    : fallback
}

function readCssColor(
  value: string | boolean | undefined,
  fallback: string
): string {
  if (
    typeof value === "string" &&
    /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})|rgb[a]?\(.+\)|hsl[a]?\(.+\)|var\(.+\))$/.test(
      value.trim()
    )
  ) {
    return value.trim()
  }

  return fallback
}

function normalizeSelectValue<T extends string>(
  value: string | boolean | undefined,
  options: T[],
  fallback: T
): T {
  return typeof value === "string" && options.includes(value as T)
    ? (value as T)
    : fallback
}

function getReadableTextColor(hex: string): string {
  const normalized = hex.replace("#", "")
  const fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((segment) => `${segment}${segment}`)
          .join("")
      : normalized

  if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
    return "#ffffff"
  }

  const int = Number.parseInt(fullHex, 16)
  const red = (int >> 16) & 255
  const green = (int >> 8) & 255
  const blue = int & 255
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000

  return luminance >= 160 ? "#111111" : "#ffffff"
}
