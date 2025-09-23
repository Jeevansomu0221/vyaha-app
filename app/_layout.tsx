import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "./context/AuthContext"; // ✅ Auth context
import { CartProvider } from "./context/CartContext"; // ✅ Cart context

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null; // ⏳ wait until fonts load
  }

  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* Main Tabs Navigation */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Not Found Page */}
            <Stack.Screen name="+not-found" />

            {/* 🔐 Auth Screens (login/signup/otp) */}
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
            <Stack.Screen name="auth/otp" options={{ headerShown: false }} />

            {/* 📝 Onboarding Screen (after OTP) */}
            <Stack.Screen
              name="auth/onboarding"
              options={{ headerShown: false }}
            />
          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}
