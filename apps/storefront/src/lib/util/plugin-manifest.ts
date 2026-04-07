type StorefrontPluginRuntimeTarget =
  | "medusa/admin"
  | "medusa/storefront"
  | "medusa/backend"
  | "control-plane"

export interface StorefrontPluginManifestEntry {
  id: string
  name?: string
  slug: string
  version: string
  runtimeTarget: StorefrontPluginRuntimeTarget
  capabilities: string[]
  config: Record<string, string | boolean>
  artifactUrl?: string | null
  artifactIntegrity?: string | null
  assets?: Record<string, unknown> | null
  assetUpdatedAt?: string | null
}

export interface StorefrontPluginManifestEnvelope {
  version: string
  storeId: string
  generatedAt: string
  manifestHash: string
  runtimeCounts: Record<StorefrontPluginRuntimeTarget, number>
  entries: StorefrontPluginManifestEntry[]
}

const EMPTY_COUNTS: StorefrontPluginManifestEnvelope["runtimeCounts"] = {
  "medusa/admin": 0,
  "medusa/storefront": 0,
  "medusa/backend": 0,
  "control-plane": 0,
}

export function readStorefrontPluginManifest(): StorefrontPluginManifestEnvelope {
  const raw = process.env.MEDUSA_SAAS_PLUGIN_MANIFEST

  if (!raw) {
    return createEmptyManifest()
  }

  try {
    const parsed = JSON.parse(raw) as
      | StorefrontPluginManifestEnvelope
      | StorefrontPluginManifestEntry[]

    if (Array.isArray(parsed)) {
      return {
        version: process.env.MEDUSA_SAAS_PLUGIN_MANIFEST_VERSION ?? "legacy",
        storeId: "unknown",
        generatedAt: "",
        manifestHash: process.env.MEDUSA_SAAS_PLUGIN_MANIFEST_HASH ?? "unknown",
        runtimeCounts: buildRuntimeCounts(parsed),
        entries: parsed,
      }
    }

    if (!Array.isArray(parsed.entries)) {
      return createEmptyManifest()
    }

    return {
      version: parsed.version ?? process.env.MEDUSA_SAAS_PLUGIN_MANIFEST_VERSION ?? "legacy",
      storeId: parsed.storeId ?? "unknown",
      generatedAt: parsed.generatedAt ?? "",
      manifestHash:
        parsed.manifestHash ??
        process.env.MEDUSA_SAAS_PLUGIN_MANIFEST_HASH ??
        "unknown",
      runtimeCounts: parsed.runtimeCounts ?? buildRuntimeCounts(parsed.entries),
      entries: parsed.entries,
    }
  } catch {
    return createEmptyManifest()
  }
}

export function getStorefrontPlugins(): StorefrontPluginManifestEntry[] {
  return readStorefrontPluginManifest().entries.filter(
    (entry) => entry.runtimeTarget === "medusa/storefront"
  )
}

export function getStorefrontPluginById(
  pluginId: string
): StorefrontPluginManifestEntry | null {
  return getStorefrontPlugins().find((plugin) => plugin.id === pluginId) ?? null
}

export function getSeoToolkitSiteName(): string {
  const plugin = getStorefrontPluginById("seo")
  const siteName = plugin?.config?.siteName
  return typeof siteName === "string" && siteName.trim().length > 0
    ? siteName.trim()
    : "Panda AI Store"
}

export function isStorefrontPluginEnabled(pluginId: string): boolean {
  return Boolean(getStorefrontPluginById(pluginId))
}

export type StorefrontPluginHighlight = {
  pluginId: string
  pluginName: string
  badge: string
  title: string
  description: string
  ctaLabel: string | null
  ctaHref: string | null
}

export function getStorefrontPluginHighlights(): StorefrontPluginHighlight[] {
  return getStorefrontPlugins()
    .map((plugin) => {
      const storefront = readRecord(plugin.assets?.storefront)
      const highlight = readRecord(storefront?.productHighlight)
      if (!highlight) {
        return null
      }

      const title = readStringValue(highlight.title)
      const description = readStringValue(highlight.description)
      if (!title || !description) {
        return null
      }

      return {
        pluginId: plugin.id,
        pluginName:
          typeof plugin.name === "string" && plugin.name.trim().length > 0
            ? plugin.name.trim()
            : plugin.slug,
        badge: readStringValue(highlight.badge) ?? "Plugin bundle",
        title,
        description,
        ctaLabel: readStringValue(highlight.ctaLabel),
        ctaHref: readStringValue(highlight.ctaHref),
      } satisfies StorefrontPluginHighlight
    })
    .filter((entry): entry is StorefrontPluginHighlight => Boolean(entry))
}

function createEmptyManifest(): StorefrontPluginManifestEnvelope {
  return {
    version: process.env.MEDUSA_SAAS_PLUGIN_MANIFEST_VERSION ?? "legacy",
    storeId: "unknown",
    generatedAt: "",
    manifestHash: process.env.MEDUSA_SAAS_PLUGIN_MANIFEST_HASH ?? "unknown",
    runtimeCounts: { ...EMPTY_COUNTS },
    entries: [],
  }
}

function buildRuntimeCounts(
  entries: StorefrontPluginManifestEntry[]
): StorefrontPluginManifestEnvelope["runtimeCounts"] {
  return entries.reduce(
    (counts, entry) => {
      counts[entry.runtimeTarget] += 1
      return counts
    },
    { ...EMPTY_COUNTS }
  )
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function readStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null
}
