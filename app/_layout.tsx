import { initDatabase } from "@/database/database";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/context/auth";
import { router, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import "react-native-get-random-values";
import "react-native-reanimated";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../global.css";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const theme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    initDatabase();
  }, []);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={DefaultTheme}>
        <StatusBar translucent style={theme === "dark" ? "light" : "dark"} />
        <SQLiteProvider databaseName="alerts.db">
          <SafeAreaProvider>
            <AuthProvider>
              <AppStack />
            </AuthProvider>
            <Toast />
          </SafeAreaProvider>
        </SQLiteProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppStack() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || isAuthenticated === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
