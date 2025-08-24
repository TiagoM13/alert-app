import { FloatingButton } from "@/components/floating-button";
import { Theme } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, usePathname } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function TabLayout() {
  const pathname = usePathname();

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const isRegister = pathname === "/register";

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: isRegister ? 100 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isRegister ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginBottom: 8,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Theme.colors.white,
          height: 85,
          paddingTop: 5,
          paddingBottom: 20,
          borderTopWidth: 1,
          borderTopColor: Theme.colors.cardBackground,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 4,
        },
        animation: "shift",
      }}
      tabBar={(props) => {
        const DefaultTabBar =
          require("@react-navigation/bottom-tabs").BottomTabBar;

        return (
          <Animated.View
            style={{
              transform: [{ translateY }],
              opacity,
            }}
          >
            <DefaultTabBar {...props} />
          </Animated.View>
        );
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="register"
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: () => (
            <View style={{ flex: 1, alignItems: "center" }}>
              <FloatingButton />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
