import type { HttpTypes } from "@medusajs/types";

type AddressLike = {
  address_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
  country?: {
    display_name?: string | null;
    name?: string | null;
    iso_2?: string | null;
  } | null;
};

export function getDefaultShippingAddress(
  addresses: HttpTypes.StoreCustomerAddress[]
) {
  return addresses.find((address) => address.is_default_shipping) ?? addresses[0] ?? null;
}

export function getDefaultBillingAddress(
  addresses: HttpTypes.StoreCustomerAddress[]
) {
  return addresses.find((address) => address.is_default_billing) ?? addresses[0] ?? null;
}

export function getAddressTitle(address?: AddressLike | null) {
  if (!address) {
    return "";
  }

  const name = [address.first_name, address.last_name].filter(Boolean).join(" ").trim();
  return address.address_name || name || address.address_1 || "";
}

export function formatAddressLines(address?: AddressLike | null) {
  if (!address) {
    return [];
  }

  const countryName =
    address.country?.display_name ||
    address.country?.name ||
    address.country_code?.toUpperCase() ||
    null;

  return [
    address.address_1,
    [address.city, address.province].filter(Boolean).join(", "),
    [address.postal_code, countryName].filter(Boolean).join(" "),
    address.phone,
  ].filter((value) => Boolean(value && value.trim().length > 0));
}

export function formatOrderDate(
  value: string | Date | null | undefined,
  locale: string
) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
