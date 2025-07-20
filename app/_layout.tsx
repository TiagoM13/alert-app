import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import "../global.css";

export default function RootLayout() {
  const theme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular delay de verificação (ex: AsyncStorage ou API)
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Simular usuário autenticado (troque para false para testar auth)
      setIsAuthenticated(false);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (!loaded || loading) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar translucent style={theme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Rotas protegidas
          <Stack.Screen name="(tabs)" />
        ) : (
          // Telas de autenticação
          <Stack.Screen name="(auth)" />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
