import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/cart-context';
import { useI18n } from '@/lib/i18n/use-i18n';
import { getStorefrontSiteName } from '@/lib/storefront-branding';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { cart } = useCart();
  const { messages } = useI18n();
  const storefrontSiteName = getStorefrontSiteName();

  const itemCount = cart?.items?.length || 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          title: storefrontSiteName || messages.home.title,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerShown: false, // Let the home stack manage its own headers
        }}
      />
      <Tabs.Screen
        name="(chatbot)"
        options={{
          title: messages.chatbot.title,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(cart)"
        options={{
          title: messages.cart.title,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tint,
          },
          headerShown: false, // Let the cart stack manage its own headers
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: messages.account.title,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
