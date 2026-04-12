import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { sdk } from "@/lib/sdk";
import type { HttpTypes } from "@medusajs/types";

import { useCart } from "./cart-context";

type RegisterCustomerInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

type UpdateCustomerInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

type CustomerAddressInput = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
};

type CustomerContextValue = {
  customer: HttpTypes.StoreCustomer | null;
  addresses: HttpTypes.StoreCustomerAddress[];
  loading: boolean;
  authLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterCustomerInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
  updateCustomer: (input: UpdateCustomerInput) => Promise<void>;
  refreshAddresses: () => Promise<HttpTypes.StoreCustomerAddress[]>;
  createAddress: (input: CustomerAddressInput) => Promise<void>;
  updateAddress: (addressId: string, input: CustomerAddressInput) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  listOrders: (query?: HttpTypes.StoreOrderFilters) => Promise<HttpTypes.StoreOrder[]>;
  retrieveOrder: (orderId: string) => Promise<HttpTypes.StoreOrder>;
  clearError: () => void;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

function mapAddressInputToPayload(input: CustomerAddressInput) {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    address_1: input.address,
    city: input.city,
    postal_code: input.postalCode,
    country_code: input.countryCode,
    phone: input.phone,
    is_default_shipping: input.isDefaultShipping,
    is_default_billing: input.isDefaultBilling,
  };
}

function mapCustomerInputToPayload(input: UpdateCustomerInput) {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    phone: input.phone,
  };
}

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const { cart, refreshCart } = useCart();
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null);
  const [addresses, setAddresses] = useState<HttpTypes.StoreCustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transferredCartIdRef = useRef<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const { addresses: fetchedAddresses } = await sdk.store.customer.listAddress({
        fields: "*",
      });

      setAddresses(fetchedAddresses);
      return fetchedAddresses;
    } catch {
      setAddresses([]);
      return [];
    }
  }, []);

  const refreshCustomer = useCallback(async () => {
    try {
      const { customer: fetchedCustomer } = await sdk.store.customer.retrieve({
        fields: "*orders",
      });

      setCustomer(fetchedCustomer);
      await fetchAddresses();
      setError(null);
    } catch {
      setCustomer(null);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAddresses]);

  const updateCustomer = useCallback(
    async (input: UpdateCustomerInput) => {
      setError(null);

      try {
        await sdk.store.customer.update(mapCustomerInputToPayload(input));
        await refreshCustomer();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update customer profile";
        setError(message);
        throw err;
      }
    },
    [refreshCustomer]
  );

  const createAddress = useCallback(
    async (input: CustomerAddressInput) => {
      setError(null);

      try {
        await sdk.store.customer.createAddress(mapAddressInputToPayload(input));
        await refreshCustomer();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create customer address";
        setError(message);
        throw err;
      }
    },
    [refreshCustomer]
  );

  const updateAddress = useCallback(
    async (addressId: string, input: CustomerAddressInput) => {
      setError(null);

      try {
        await sdk.store.customer.updateAddress(
          addressId,
          mapAddressInputToPayload(input)
        );
        await refreshCustomer();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update customer address";
        setError(message);
        throw err;
      }
    },
    [refreshCustomer]
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      setError(null);

      try {
        await sdk.store.customer.deleteAddress(addressId);
        await refreshCustomer();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete customer address";
        setError(message);
        throw err;
      }
    },
    [refreshCustomer]
  );

  const listOrders = useCallback(async (query?: HttpTypes.StoreOrderFilters) => {
    const { orders } = await sdk.store.order.list({
      order: "-created_at",
      limit: 10,
      fields:
        "*items,*items.variant,*items.product,*shipping_methods,*fulfillments,*payment_collections",
      ...query,
    });

    return orders;
  }, []);

  const retrieveOrder = useCallback(async (orderId: string) => {
    const { order } = await sdk.store.order.retrieve(orderId, {
      fields:
        "*payment_collections.payments,*items,*items.adjustments,*items.variant,*items.product,*shipping_methods,*shipping_methods.adjustments,*fulfillments,*billing_address,*shipping_address",
    });

    return order;
  }, []);

  const syncCartWithCustomer = useCallback(async () => {
    if (!cart?.id) {
      return;
    }

    await sdk.store.cart.transferCart(cart.id);
    await refreshCart();
  }, [cart?.id, refreshCart]);

  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  useEffect(() => {
    if (!customer || !cart?.id || cart.customer_id || transferredCartIdRef.current === cart.id) {
      return;
    }

    transferredCartIdRef.current = cart.id;

    syncCartWithCustomer().catch(() => {
      transferredCartIdRef.current = null;
    });
  }, [cart?.customer_id, cart?.id, customer, syncCartWithCustomer]);

  const login = useCallback(
    async (email: string, password: string) => {
      setAuthLoading(true);
      setError(null);

      try {
        const authResult = await sdk.auth.login("customer", "emailpass", {
          email,
          password,
        });

        if (typeof authResult !== "string") {
          throw new Error("AUTH_REQUIRES_ACTION");
        }

        await syncCartWithCustomer().catch(() => null);
        await refreshCustomer();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to sign in customer";
        setError(message);
        throw err;
      } finally {
        setAuthLoading(false);
      }
    },
    [refreshCustomer, syncCartWithCustomer]
  );

  const register = useCallback(
    async ({ email, password, firstName, lastName, phone }: RegisterCustomerInput) => {
      setAuthLoading(true);
      setError(null);

      try {
        const registrationToken = await sdk.auth.register("customer", "emailpass", {
          email,
          password,
        });

        await sdk.store.customer.create(
          {
            email,
            first_name: firstName,
            last_name: lastName,
            phone,
          },
          {},
          {
            authorization: `Bearer ${registrationToken}`,
          }
        );

        const loginResult = await sdk.auth.login("customer", "emailpass", {
          email,
          password,
        });

        if (typeof loginResult !== "string") {
          throw new Error("AUTH_REQUIRES_ACTION");
        }

        await syncCartWithCustomer().catch(() => null);
        await refreshCustomer();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to register customer";
        setError(message);
        throw err;
      } finally {
        setAuthLoading(false);
      }
    },
    [refreshCustomer, syncCartWithCustomer]
  );

  const logout = useCallback(async () => {
    setAuthLoading(true);
    setError(null);

    try {
      await sdk.auth.logout();
      setCustomer(null);
      setAddresses([]);
      transferredCartIdRef.current = null;
      await refreshCart().catch(() => null);
    } finally {
      setAuthLoading(false);
    }
  }, [refreshCart]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customer,
        addresses,
        loading,
        authLoading,
        error,
        isAuthenticated: Boolean(customer),
        login,
        register,
        logout,
        refreshCustomer,
        updateCustomer,
        refreshAddresses: fetchAddresses,
        createAddress,
        updateAddress,
        deleteAddress,
        listOrders,
        retrieveOrder,
        clearError,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }

  return context;
}
