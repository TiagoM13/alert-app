import { FloatingButton } from "@/components/floating-button";
import { Theme } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarLabelStyle: {
          fontSize: 14,
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={32} color={color} />
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
            <Ionicons name="time" size={32} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
