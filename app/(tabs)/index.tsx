import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { FloatingButton } from "@/components/floating-button";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";

export default function Home() {
  const handleBellPress = () => {
    console.log("Sino pressionado!");
  };

  const handleUserAvatarPress = () => {
    router.push("/profile");
  };

  const handleAddAlert = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Alerts"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View className="flex-1 relative px-4 gap-5">
        <AlertList />
        <FloatingButton onPress={handleAddAlert} />
      </View>
    </SafeAreaView>
  );
}
