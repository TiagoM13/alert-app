import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { Alert } from "@/components/alerts/types";
import { useAuth } from "@/context/auth";
import { fetchAlerts } from "@/database/database";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);

  const loadAlerts = async () => {
    setIsLoading(true);

    setTimeout(async () => {
      try {
        if (!user) return;
        const data = await fetchAlerts(user.id);
        setCurrentAlerts(data);
      } catch (error) {
        console.error("Erro ao carregar alertas:", error);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
      return () => {};
    }, [])
  );

  const handleBellPress = () => {
    console.log("Sino pressionado!");
  };

  const handleUserAvatarPress = () => {
    router.push("/profile");
  };

  const handleAlertPress = (alertId: string) => {
    router.push({ pathname: "/register", params: { id: alertId } });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Alerts"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View className="flex-1 relative px-6 gap-5">
        <AlertList
          alerts={currentAlerts}
          onAlertPress={handleAlertPress}
          isLoading={isLoading}
          onAlertDeleted={loadAlerts}
        />
      </View>
    </SafeAreaView>
  );
}
