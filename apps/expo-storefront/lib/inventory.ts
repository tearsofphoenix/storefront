import type { HttpTypes } from "@medusajs/types";

/**
 * Check if a product variant is in stock
 * A variant is in stock if:
 * - manage_inventory is false (inventory tracking disabled), OR
 * - inventory_quantity is greater than 0
 */
export function isVariantInStock(
  variant: HttpTypes.StoreProductVariant | undefined | null
): boolean {
  if (!variant) {
    return false;
  }

  return (
    variant.manage_inventory === false ||
    variant.allow_backorder === true ||
    (variant.inventory_quantity || 0) > 0
  );
}

export function getVariantMaxQuantity(
  variant: HttpTypes.StoreProductVariant | undefined | null,
  fallbackMax = 10
): number {
  if (!variant) {
    return 0;
  }

  if (variant.manage_inventory === false || variant.allow_backorder === true) {
    return fallbackMax;
  }

  if (typeof variant.inventory_quantity === "number") {
    return Math.max(0, Math.min(variant.inventory_quantity, fallbackMax));
  }

  return fallbackMax;
}
