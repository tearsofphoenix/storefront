import { useColorScheme } from '@/hooks/use-color-scheme';
import { DrawerActions } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useI18n } from '@/lib/i18n/use-i18n';

export default function AccountStackLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const colors = Colors[colorScheme ?? 'light'];
  const { messages } = useI18n();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: messages.account.title,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ height: 36, width: 36, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <IconSymbol size={28} name="line.3.horizontal" color={colors.icon} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: messages.account.signIn,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: messages.account.createAccount,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: messages.account.profile,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="orders/index"
        options={{
          title: messages.account.orders,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="orders/[id]"
        options={{
          title: messages.order.orderDetailsTitle,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="addresses/index"
        options={{
          title: messages.account.addresses,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="addresses/form"
        options={{
          title: messages.account.addressFormTitle,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
