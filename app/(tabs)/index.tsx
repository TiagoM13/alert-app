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

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!user) return;
      const data = await fetchAlerts(user.id);
      setCurrentAlerts(data);
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
      return () => {};
    }, [loadAlerts])
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

  const handleAlertDeleted = (deletedId: string) => {
    setCurrentAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== deletedId)
    );
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
          onAlertDeleted={handleAlertDeleted}
        />
      </View>
    </SafeAreaView>
  );
}
