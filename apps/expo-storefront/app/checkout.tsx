import { DeliveryStep } from '@/components/checkout/delivery-step';
import { PaymentStep } from '@/components/checkout/payment-step';
import { ShippingStep } from '@/components/checkout/shipping-step';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/cart-context';
import { useCustomer } from '@/context/customer-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/lib/i18n/use-i18n';
import { sdk } from '@/lib/sdk';
import type { HttpTypes } from '@medusajs/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

type CheckoutStep = 'delivery' | 'shipping' | 'payment';
type CheckoutAddress = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
  phone: string;
};
type AddressSource = {
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
};

const EMPTY_ADDRESS: CheckoutAddress = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  countryCode: '',
  phone: '',
};

function mapAddress(source?: AddressSource | null): CheckoutAddress {
  return {
    firstName: source?.first_name || '',
    lastName: source?.last_name || '',
    address: source?.address_1 || '',
    city: source?.city || '',
    postalCode: source?.postal_code || '',
    countryCode: source?.country_code || '',
    phone: source?.phone || '',
  };
}

function areAddressesEqual(left: CheckoutAddress, right: CheckoutAddress) {
  return (
    left.firstName === right.firstName &&
    left.lastName === right.lastName &&
    left.address === right.address &&
    left.city === right.city &&
    left.postalCode === right.postalCode &&
    left.countryCode === right.countryCode &&
    left.phone === right.phone
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { cart, refreshCart } = useCart();
  const { customer, addresses, isAuthenticated } = useCustomer();
  const { messages } = useI18n();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  const [loading, setLoading] = useState(false);

  // Contact & Address state
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [useSameForBilling, setUseSameForBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS);

  // Shipping step
  const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreCartShippingOption[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<string | null>(null);

  // Payment step
  const [paymentProviders, setPaymentProviders] = useState<HttpTypes.StorePaymentProvider[]>([]);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string | null>(null);

  const defaultShippingAddress = useMemo(() => {
    return (
      addresses.find(
        (address) =>
          address.id === customer?.default_shipping_address_id ||
          address.is_default_shipping
      ) ||
      addresses[0] ||
      null
    );
  }, [addresses, customer?.default_shipping_address_id]);

  const defaultBillingAddress = useMemo(() => {
    return (
      addresses.find(
        (address) =>
          address.id === customer?.default_billing_address_id ||
          address.is_default_billing
      ) ||
      defaultShippingAddress ||
      null
    );
  }, [addresses, customer?.default_billing_address_id, defaultShippingAddress]);

  // Sync form state with cart values (handles both prepopulation and reset)
  useEffect(() => {
    const fallbackCustomerAddress: AddressSource = {
      first_name: customer?.first_name,
      last_name: customer?.last_name,
      phone: customer?.phone || undefined,
    };
    const nextShippingAddress = cart?.shipping_address
      ? mapAddress(cart.shipping_address)
      : mapAddress({
          ...fallbackCustomerAddress,
          ...defaultShippingAddress,
        });
    const nextBillingAddress = cart?.billing_address
      ? mapAddress(cart.billing_address)
      : mapAddress({
          ...fallbackCustomerAddress,
          ...(defaultBillingAddress || defaultShippingAddress),
        });

    setEmail(cart?.email || customer?.email || '');
    setShippingAddress(nextShippingAddress);
    setBillingAddress(nextBillingAddress);
    setUseSameForBilling(areAddressesEqual(nextShippingAddress, nextBillingAddress));
    setSelectedShippingOption(cart?.shipping_methods?.[0]?.shipping_option_id || null);
    setSelectedPaymentProvider(
      cart?.payment_collection?.payment_sessions?.[0]?.provider_id || null
    );

    if (!cart) {
      setCurrentStep('delivery');
    }
  }, [cart, customer, defaultBillingAddress, defaultShippingAddress]);

  const fetchShippingOptions = useCallback(async () => {
    if (!cart) return;

    try {
      setLoading(true);
      const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
        cart_id: cart.id,
      });
      setShippingOptions(shipping_options || []);
    } catch (err) {
      console.error('Failed to fetch shipping options:', err);
      Alert.alert(messages.checkout.title, messages.checkout.failedToLoadShipping);
    } finally {
      setLoading(false);
    }
  }, [cart, messages.checkout.failedToLoadShipping, messages.checkout.title]);

  const fetchPaymentProviders = useCallback(async () => {
    if (!cart) return;

    try {
      setLoading(true);
      const { payment_providers } = await sdk.store.payment.listPaymentProviders({
        region_id: cart.region_id || '',
      });
      setPaymentProviders(payment_providers || []);
    } catch (err) {
      console.error('Failed to fetch payment providers:', err);
      Alert.alert(messages.checkout.title, messages.checkout.failedToLoadPayment);
    } finally {
      setLoading(false);
    }
  }, [cart, messages.checkout.failedToLoadPayment, messages.checkout.title]);

  useEffect(() => {
    if (currentStep === 'shipping') {
      fetchShippingOptions();
    } else if (currentStep === 'payment') {
      fetchPaymentProviders();
    }
  }, [currentStep, fetchShippingOptions, fetchPaymentProviders]);

  const handleDeliveryNext = async () => {
    // Validate shipping address
    if (!email || !shippingAddress.firstName || !shippingAddress.lastName || 
        !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || 
        !shippingAddress.countryCode || !shippingAddress.phone) {
      Alert.alert(messages.checkout.title, messages.checkout.fillShippingFields);
      return;
    }

    // Validate billing address if different
    if (!useSameForBilling) {
      if (!billingAddress.firstName || !billingAddress.lastName || !billingAddress.address || 
          !billingAddress.city || !billingAddress.postalCode || !billingAddress.countryCode || 
          !billingAddress.phone) {
        Alert.alert(messages.checkout.title, messages.checkout.fillBillingFields);
        return;
      }
    }

    if (!cart) return;

    try {
      setLoading(true);
      const shippingAddressData = {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        address_1: shippingAddress.address,
        city: shippingAddress.city,
        postal_code: shippingAddress.postalCode,
        country_code: shippingAddress.countryCode,
        phone: shippingAddress.phone,
      };

      const billingAddressData = useSameForBilling ? shippingAddressData : {
        first_name: billingAddress.firstName,
        last_name: billingAddress.lastName,
        address_1: billingAddress.address,
        city: billingAddress.city,
        postal_code: billingAddress.postalCode,
        country_code: billingAddress.countryCode,
        phone: billingAddress.phone,
      };

      await sdk.store.cart.update(cart.id, {
        email,
        shipping_address: shippingAddressData,
        billing_address: billingAddressData,
      });

      await refreshCart();
      setCurrentStep('shipping');
    } catch (err) {
      console.error('Failed to update cart:', err);
      Alert.alert(messages.checkout.title, messages.checkout.failedToSaveDelivery);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingNext = async () => {
    if (!selectedShippingOption || !cart) {
      Alert.alert(messages.checkout.title, messages.checkout.selectShippingError);
      return;
    }

    try {
      setLoading(true);

      await sdk.store.cart.addShippingMethod(cart.id, {
        option_id: selectedShippingOption,
      });

      await refreshCart();
      setCurrentStep('payment');
    } catch (err) {
      console.error('Failed to add shipping method:', err);
      Alert.alert(messages.checkout.title, messages.checkout.failedToSaveShipping);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentProvider || !cart) {
      Alert.alert(messages.checkout.title, messages.checkout.selectPaymentError);
      return;
    }

    try {
      setLoading(true);

      // Create payment session
      await sdk.store.payment.initiatePaymentSession(cart, {
        provider_id: selectedPaymentProvider,
      });

      // Complete cart (converts cart to order on backend)
      const result = await sdk.store.cart.complete(cart.id);

      if (result.type === 'order') {
        // Navigate to order confirmation first
        // Cart will be cleared on the order confirmation page to prevent empty cart flash
        router.replace(`/order-confirmation/${result.order.id}`);
      } else {
        Alert.alert(
          messages.checkout.title,
          result.error?.message || messages.checkout.failedToCompleteOrder
        );
      }
    } catch (err: any) {
      console.error('Failed to complete order:', err);
      Alert.alert(
        messages.checkout.title,
        err?.message || messages.checkout.failedToCompleteOrder
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {messages.checkout.noCartFound}
        </Text>
      </View>
    );
  }

  // Active step uses inverted colors: white bg with dark text in dark mode, tint bg with white text in light mode
  const activeStepBg = colorScheme === 'dark' ? '#fff' : colors.tint;
  const activeStepText = colorScheme === 'dark' ? '#000' : '#fff';
  const stepLabels: Record<CheckoutStep, string> = {
    delivery: messages.checkout.delivery,
    shipping: messages.checkout.shipping,
    payment: messages.checkout.payment,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isAuthenticated && currentStep === 'delivery' ? (
        <View
          style={[
            styles.authBanner,
            {
              backgroundColor: colors.background,
              borderBottomColor: `${colors.icon}20`,
            },
          ]}
        >
          <Text style={[styles.authTitle, { color: colors.text }]}>
            {messages.account.signIn}
          </Text>
          <Text style={[styles.authDescription, { color: colors.icon }]}>
            {messages.account.signInSubtitle}
          </Text>
          <Button
            title={messages.account.signIn}
            variant="secondary"
            onPress={() => router.push("/(drawer)/(tabs)/(account)/login")}
          />
        </View>
      ) : null}
      <View style={[styles.steps, { borderBottomColor: colors.border }]}>
        {(['delivery', 'shipping', 'payment'] as CheckoutStep[]).map((step, index) => (
          <View key={step} style={styles.stepIndicator}>
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor:
                    currentStep === step ? activeStepBg : colors.icon + '30',
                },
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  { color: currentStep === step ? activeStepText : colors.icon },
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                {
                  color: currentStep === step ? colors.text : colors.icon,
                  fontWeight: currentStep === step ? '600' : '400',
                },
              ]}
            >
              {stepLabels[step]}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        {currentStep === 'delivery' && (
          <DeliveryStep
            email={email}
            shippingAddress={shippingAddress}
            billingAddress={billingAddress}
            useSameForBilling={useSameForBilling}
            loading={loading}
            onEmailChange={setEmail}
            onShippingAddressChange={(field, value) => 
              setShippingAddress(prev => ({ ...prev, [field]: value }))
            }
            onBillingAddressChange={(field, value) => 
              setBillingAddress(prev => ({ ...prev, [field]: value }))
            }
            onUseSameForBillingChange={setUseSameForBilling}
            onNext={handleDeliveryNext}
          />
        )}

        {currentStep === 'shipping' && (
          <ShippingStep
            shippingOptions={shippingOptions}
            selectedShippingOption={selectedShippingOption}
            currencyCode={cart.currency_code}
            loading={loading}
            onSelectOption={setSelectedShippingOption}
            onBack={() => setCurrentStep('delivery')}
            onNext={handleShippingNext}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentStep
            cart={cart}
            paymentProviders={paymentProviders}
            selectedPaymentProvider={selectedPaymentProvider}
            loading={loading}
            onSelectProvider={setSelectedPaymentProvider}
            onBack={() => setCurrentStep('shipping')}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authBanner: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  authDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
