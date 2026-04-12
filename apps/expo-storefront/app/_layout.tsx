import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { CartProvider } from '@/context/cart-context';
import { CustomerProvider } from '@/context/customer-context';
import { RegionProvider } from '@/context/region-context';
import { I18nProvider } from '@/lib/i18n/provider';
import { useI18n } from '@/lib/i18n/use-i18n';

function AppStack() {
  const { messages } = useI18n();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="oauth/google"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          headerShown: true,
          title: messages.checkout.title,
          presentation: 'card',
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="order-confirmation/[id]"
        options={{
          headerShown: true,
          title: messages.order.confirmedTitle,
          headerLeft: () => null,
          gestureEnabled: false,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <I18nProvider>
          <RegionProvider>
            <CartProvider>
              <CustomerProvider>
                <AppStack />
                <StatusBar style="auto" />
              </CustomerProvider>
            </CartProvider>
          </RegionProvider>
        </I18nProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
