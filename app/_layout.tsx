import { initDatabase } from "@/database/database";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/context/auth";
import { checkAndUpdateOverdueAlerts } from "@/services";
import { SplashScreen, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { AppState } from "react-native";
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

  const { user } = useAuth();

  useEffect(() => {
    // Função que roda quando o app ganha foco
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === "active" && user?.id) {
        console.log("📱 App ganhou foco - verificando alertas vencidos...");
        try {
          await checkAndUpdateOverdueAlerts(user.id);
          console.log("✅ Verificação de alertas concluída");
        } catch (error) {
          console.error("❌ Erro na verificação:", error);
        }
      }
    };

    // Verificação inicial quando o app carrega
    if (user?.id) {
      checkAndUpdateOverdueAlerts(user.id);
    }

    // Listener para mudanças de estado do app
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, [user?.id]);

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
