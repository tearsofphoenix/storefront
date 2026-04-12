import { AddressForm } from '@/components/checkout/address-form';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useRegion } from '@/context/region-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatAddressLines, getAddressTitle } from '@/lib/account';
import { useI18n } from '@/lib/i18n/use-i18n';
import type { HttpTypes } from '@medusajs/types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
  phone: string;
}

interface DeliveryStepProps {
  email: string;
  savedAddresses: HttpTypes.StoreCustomerAddress[];
  shippingAddress: Address;
  billingAddress: Address;
  useSameForBilling: boolean;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onShippingAddressChange: (field: keyof Address, value: string) => void;
  onBillingAddressChange: (field: keyof Address, value: string) => void;
  onUseSameForBillingChange: (value: boolean) => void;
  onSelectShippingAddress: (address: HttpTypes.StoreCustomerAddress) => void;
  onSelectBillingAddress: (address: HttpTypes.StoreCustomerAddress) => void;
  onNext: () => void;
}

export function DeliveryStep({
  email,
  savedAddresses,
  shippingAddress,
  billingAddress,
  useSameForBilling,
  loading,
  onEmailChange,
  onShippingAddressChange,
  onBillingAddressChange,
  onUseSameForBillingChange,
  onSelectShippingAddress,
  onSelectBillingAddress,
  onNext,
}: DeliveryStepProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { selectedRegion } = useRegion();
  const { messages } = useI18n();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const countries = useMemo(() => selectedRegion?.countries || [], [selectedRegion?.countries]);
  const countriesInRegion = useMemo(
    () => countries.map((country) => country.iso_2 || country.id).filter(Boolean),
    [countries]
  );
  const addressesInRegion = useMemo(
    () =>
      savedAddresses.filter(
        (address) =>
          address.country_code &&
          countriesInRegion.includes(address.country_code)
      ),
    [countriesInRegion, savedAddresses]
  );

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const isSelectedAddress = (
    savedAddress: HttpTypes.StoreCustomerAddress,
    currentAddress: Address
  ) => {
    return (
      (savedAddress.first_name || '') === currentAddress.firstName &&
      (savedAddress.last_name || '') === currentAddress.lastName &&
      (savedAddress.address_1 || '') === currentAddress.address &&
      (savedAddress.city || '') === currentAddress.city &&
      (savedAddress.postal_code || '') === currentAddress.postalCode &&
      (savedAddress.country_code || '') === currentAddress.countryCode &&
      (savedAddress.phone || '') === currentAddress.phone
    );
  };

  const renderSavedAddresses = (
    currentAddress: Address,
    onSelectAddress: (address: HttpTypes.StoreCustomerAddress) => void
  ) => {
    if (addressesInRegion.length === 0) {
      return null;
    }

    return (
      <View
        style={[
          styles.savedAddressesCard,
          {
            backgroundColor: colors.background,
            borderColor: `${colors.icon}20`,
          },
        ]}
      >
        <Text style={[styles.savedAddressesTitle, { color: colors.text }]}>
          {messages.account.savedAddresses}
        </Text>
        <Text style={[styles.savedAddressesDescription, { color: colors.icon }]}>
          {messages.checkout.useSavedAddress}
        </Text>

        <View style={styles.savedAddressesList}>
          {addressesInRegion.map((address) => {
            const isSelected = isSelectedAddress(address, currentAddress);

            return (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.savedAddressOption,
                  {
                    backgroundColor: isSelected
                      ? `${colors.tint}12`
                      : colors.background,
                    borderColor: isSelected ? colors.tint : `${colors.icon}20`,
                  },
                ]}
                onPress={() => onSelectAddress(address)}
              >
                <Text
                  style={[
                    styles.savedAddressName,
                    { color: isSelected ? colors.tint : colors.text },
                  ]}
                >
                  {getAddressTitle(address) || messages.checkout.savedAddress}
                </Text>

                {formatAddressLines(address).map((line) => (
                  <Text
                    key={`${address.id}-${line}`}
                    style={[styles.savedAddressLine, { color: colors.icon }]}
                  >
                    {line}
                  </Text>
                ))}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible && styles.scrollContentKeyboard
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        automaticallyAdjustKeyboardInsets={true}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {messages.checkout.contactInformation}
          </Text>

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon + '30' }]}
            placeholder={messages.common.email}
            placeholderTextColor={colors.icon}
            value={email}
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
            {messages.checkout.shippingAddress}
          </Text>

          {renderSavedAddresses(shippingAddress, onSelectShippingAddress)}

          <AddressForm
            firstName={shippingAddress.firstName}
            lastName={shippingAddress.lastName}
            address={shippingAddress.address}
            city={shippingAddress.city}
            postalCode={shippingAddress.postalCode}
            countryCode={shippingAddress.countryCode}
            phone={shippingAddress.phone}
            countries={countries}
            onFirstNameChange={(value) => onShippingAddressChange('firstName', value)}
            onLastNameChange={(value) => onShippingAddressChange('lastName', value)}
            onAddressChange={(value) => onShippingAddressChange('address', value)}
            onCityChange={(value) => onShippingAddressChange('city', value)}
            onPostalCodeChange={(value) => onShippingAddressChange('postalCode', value)}
            onCountryCodeChange={(value) => onShippingAddressChange('countryCode', value)}
            onPhoneChange={(value) => onShippingAddressChange('phone', value)}
          />

          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>
              {messages.checkout.useSameForBilling}
            </Text>
            <Switch
              value={useSameForBilling}
              onValueChange={onUseSameForBillingChange}
            />
          </View>

          {!useSameForBilling && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
                {messages.checkout.billingAddress}
              </Text>

              {renderSavedAddresses(billingAddress, onSelectBillingAddress)}

              <AddressForm
                firstName={billingAddress.firstName}
                lastName={billingAddress.lastName}
                address={billingAddress.address}
                city={billingAddress.city}
                postalCode={billingAddress.postalCode}
                countryCode={billingAddress.countryCode}
                phone={billingAddress.phone}
                countries={countries}
                onFirstNameChange={(value) => onBillingAddressChange('firstName', value)}
                onLastNameChange={(value) => onBillingAddressChange('lastName', value)}
                onAddressChange={(value) => onBillingAddressChange('address', value)}
                onCityChange={(value) => onBillingAddressChange('city', value)}
                onPostalCodeChange={(value) => onBillingAddressChange('postalCode', value)}
                onCountryCodeChange={(value) => onBillingAddressChange('countryCode', value)}
                onPhoneChange={(value) => onBillingAddressChange('phone', value)}
              />
            </>
          )}
        </View>

        {/* Button moved inside ScrollView for consistent behavior */}
        <View style={[styles.buttonContainer, { backgroundColor: colors.background }]}>
          <Button
            title={messages.common.continue}
            onPress={onNext}
            loading={loading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  scrollContentKeyboard: {
    paddingBottom: Platform.OS === 'ios' ? 300 : 320,
  },
  section: {
    padding: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  savedAddressesCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  savedAddressesTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  savedAddressesDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  savedAddressesList: {
    gap: 12,
  },
  savedAddressOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  savedAddressName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  savedAddressLine: {
    fontSize: 13,
    lineHeight: 18,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    marginTop: 8,
  },
});
