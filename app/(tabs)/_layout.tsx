import { Theme } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable } from "react-native";

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
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            paddingTop: 10,
            backgroundColor: "#fff",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="register"
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: () => (
            <Pressable
              onPress={() => router.push("/register")}
              className="absolute -top-5 w-16 h-16 bg-primary rounded-full justify-center items-center shadow-md"
              style={{
                alignSelf: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Ionicons name="add" size={32} color={Theme.colors.white} />
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
