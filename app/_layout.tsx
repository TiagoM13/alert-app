import { initDatabase } from "@/database/database";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/auth";
import { SplashScreen, Stack } from "expo-router";
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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={DefaultTheme}>
        <StatusBar translucent backgroundColor="transparent" style={"dark"} />
        <SQLiteProvider databaseName="alerts.db">
          <SafeAreaProvider>
            <AuthProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="+not-found"
                  options={{ headerShown: false }}
                />
              </Stack>
            </AuthProvider>
            <Toast />
          </SafeAreaProvider>
        </SQLiteProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
