import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { alerts } from "@/database/alerts";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleBellPress = () => {
    console.log("Sino pressionado!");
  };

  const handleUserAvatarPress = () => {
    router.push("/profile");
  };

  const handleAddAlert = () => {
    router.push("/register");
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Alerts"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View className="flex-1 relative px-6 gap-5">
        <AlertList alerts={alerts} isLoading={isLoading} />
      </View>
    </SafeAreaView>
  );
}
