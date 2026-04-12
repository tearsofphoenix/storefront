import { normalizeLocale } from "@/lib/i18n/shared";

/**
 * Format a price amount with currency code
 * Note: Medusa stores prices in major units (e.g., dollars, euros)
 * so no conversion is needed
 */
export function formatPrice(
  amount: number | undefined,
  currencyCode: string | undefined,
  locale: string = "en-US"
): string {
  if (amount === undefined || !currencyCode) {
    return "--";
  }

  return new Intl.NumberFormat(normalizeLocale(locale), {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  }).format(amount);
}
