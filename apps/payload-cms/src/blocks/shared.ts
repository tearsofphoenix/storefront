import type { Field } from 'payload'

type BlockPreviewLayout =
  | 'cta'
  | 'grid'
  | 'hero'
  | 'nav'
  | 'products'
  | 'quote'
  | 'stats'
  | 'story'
  | 'table'

type BlockPreviewOptions = {
  label: string
  accent: string
  layout: BlockPreviewLayout
}

const PREVIEW_BG = '#F6F1E8'
const PREVIEW_SURFACE = '#FFFDF8'
const PREVIEW_MUTED = '#D8D0C4'
const PREVIEW_TEXT = '#1F1F1B'

const escapeSvg = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const toDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

const renderLayout = (
  layout: BlockPreviewLayout,
  accent: string,
  width: number,
  height: number
) => {
  switch (layout) {
    case 'hero':
      return `
        <rect x="18" y="32" width="${width * 0.32}" height="10" rx="5" fill="${accent}" opacity="0.95" />
        <rect x="18" y="52" width="${width * 0.34}" height="8" rx="4" fill="${PREVIEW_TEXT}" opacity="0.88" />
        <rect x="18" y="68" width="${width * 0.28}" height="8" rx="4" fill="${PREVIEW_TEXT}" opacity="0.52" />
        <rect x="${width * 0.46}" y="18" width="${width * 0.43}" height="${height - 36}" rx="18" fill="${PREVIEW_SURFACE}" />
        <rect x="${width * 0.5}" y="32" width="${width * 0.35}" height="${height * 0.42}" rx="14" fill="${accent}" opacity="0.22" />
      `
    case 'nav':
      return `
        <rect x="18" y="26" width="${width - 36}" height="40" rx="20" fill="${PREVIEW_SURFACE}" />
        <rect x="30" y="38" width="52" height="16" rx="8" fill="${PREVIEW_MUTED}" />
        <rect x="94" y="38" width="68" height="16" rx="8" fill="${accent}" opacity="0.82" />
        <rect x="174" y="38" width="58" height="16" rx="8" fill="${PREVIEW_MUTED}" />
      `
    case 'story':
      return `
        <rect x="18" y="24" width="${width * 0.42}" height="${height - 48}" rx="18" fill="${accent}" opacity="0.22" />
        <rect x="${width * 0.5}" y="34" width="${width * 0.22}" height="10" rx="5" fill="${accent}" />
        <rect x="${width * 0.5}" y="56" width="${width * 0.3}" height="8" rx="4" fill="${PREVIEW_TEXT}" opacity="0.88" />
        <rect x="${width * 0.5}" y="72" width="${width * 0.28}" height="8" rx="4" fill="${PREVIEW_TEXT}" opacity="0.52" />
        <rect x="${width * 0.5}" y="88" width="${width * 0.24}" height="8" rx="4" fill="${PREVIEW_TEXT}" opacity="0.52" />
      `
    case 'grid':
      return `
        <rect x="18" y="24" width="${width - 36}" height="10" rx="5" fill="${accent}" />
        <rect x="18" y="48" width="${(width - 48) / 2}" height="${height - 66}" rx="18" fill="${PREVIEW_SURFACE}" />
        <rect x="${width / 2 + 6}" y="48" width="${(width - 48) / 2}" height="${height - 66}" rx="18" fill="${PREVIEW_SURFACE}" />
        <rect x="30" y="62" width="${(width - 72) / 2}" height="${height * 0.26}" rx="14" fill="${accent}" opacity="0.18" />
        <rect x="${width / 2 + 18}" y="62" width="${(width - 72) / 2}" height="${height * 0.26}" rx="14" fill="${accent}" opacity="0.18" />
      `
    case 'table':
      return `
        <rect x="18" y="24" width="${width - 36}" height="${height - 48}" rx="18" fill="${PREVIEW_SURFACE}" />
        <rect x="18" y="24" width="${width - 36}" height="24" rx="18" fill="${accent}" opacity="0.18" />
        <line x1="18" y1="70" x2="${width - 18}" y2="70" stroke="${PREVIEW_MUTED}" stroke-width="2" />
        <line x1="18" y1="100" x2="${width - 18}" y2="100" stroke="${PREVIEW_MUTED}" stroke-width="2" />
        <line x1="${width * 0.42}" y1="48" x2="${width * 0.42}" y2="${height - 24}" stroke="${PREVIEW_MUTED}" stroke-width="2" />
      `
    case 'quote':
      return `
        <rect x="18" y="24" width="${width - 36}" height="${height - 48}" rx="22" fill="#171717" />
        <circle cx="46" cy="${height - 46}" r="14" fill="${accent}" opacity="0.9" />
        <rect x="36" y="48" width="${width * 0.38}" height="10" rx="5" fill="#FFFFFF" opacity="0.9" />
        <rect x="36" y="66" width="${width * 0.46}" height="10" rx="5" fill="#FFFFFF" opacity="0.75" />
        <rect x="68" y="${height - 52}" width="${width * 0.18}" height="8" rx="4" fill="#FFFFFF" opacity="0.7" />
      `
    case 'cta':
      return `
        <rect x="18" y="24" width="${width - 36}" height="${height - 48}" rx="22" fill="#171717" />
        <rect x="34" y="48" width="${width * 0.34}" height="10" rx="5" fill="#FFFFFF" opacity="0.92" />
        <rect x="34" y="66" width="${width * 0.42}" height="8" rx="4" fill="#FFFFFF" opacity="0.6" />
        <rect x="34" y="${height - 58}" width="72" height="22" rx="11" fill="#FFFFFF" />
        <rect x="116" y="${height - 58}" width="78" height="22" rx="11" fill="none" stroke="#FFFFFF" opacity="0.32" />
      `
    case 'stats':
      return `
        <rect x="18" y="24" width="${width - 36}" height="${height - 48}" rx="22" fill="#1B1B19" />
        <rect x="34" y="42" width="${width * 0.26}" height="8" rx="4" fill="#FFFFFF" opacity="0.56" />
        <rect x="34" y="74" width="44" height="22" rx="6" fill="${accent}" opacity="0.96" />
        <rect x="${width * 0.37}" y="74" width="44" height="22" rx="6" fill="${accent}" opacity="0.72" />
        <rect x="${width * 0.6}" y="74" width="44" height="22" rx="6" fill="${accent}" opacity="0.48" />
      `
    case 'products':
      return `
        <rect x="18" y="24" width="${width * 0.28}" height="10" rx="5" fill="${accent}" />
        <rect x="18" y="52" width="${(width - 48) / 2}" height="${height - 70}" rx="18" fill="${PREVIEW_SURFACE}" />
        <rect x="${width / 2 + 6}" y="52" width="${(width - 48) / 2}" height="${height - 70}" rx="18" fill="${PREVIEW_SURFACE}" />
        <rect x="30" y="64" width="${(width - 72) / 2}" height="${height * 0.28}" rx="12" fill="${accent}" opacity="0.16" />
        <rect x="${width / 2 + 18}" y="64" width="${(width - 72) / 2}" height="${height * 0.28}" rx="12" fill="${accent}" opacity="0.16" />
        <rect x="30" y="${height - 46}" width="62" height="8" rx="4" fill="${PREVIEW_TEXT}" opacity="0.8" />
        <rect x="${width / 2 + 18}" y="${height - 46}" width="62" height="8" rx="4" fill="${PREVIEW_TEXT}" opacity="0.8" />
      `
    default:
      return ''
  }
}

const renderPreviewSvg = ({
  accent,
  height,
  label,
  layout,
  width,
}: BlockPreviewOptions & {
  width: number
  height: number
}) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <rect width="${width}" height="${height}" rx="24" fill="${PREVIEW_BG}" />
    <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="20" fill="white" opacity="0.32" />
    ${renderLayout(layout, accent, width, height)}
    <text x="18" y="${height - 14}" fill="${PREVIEW_TEXT}" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="0.08em">${escapeSvg(label.toUpperCase())}</text>
  </svg>
`

export const createBlockImages = ({
  accent,
  label,
  layout,
}: BlockPreviewOptions) => ({
  icon: toDataUrl(
    renderPreviewSvg({
      accent,
      label,
      layout,
      width: 96,
      height: 72,
    })
  ),
  thumbnail: toDataUrl(
    renderPreviewSvg({
      accent,
      label,
      layout,
      width: 320,
      height: 192,
    })
  ),
})

export const anchorIdField: Field = {
  name: 'anchorId',
  type: 'text',
  admin: {
    description: '可选，用于页面内锚点导航，例如 writing-experience。',
  },
}
