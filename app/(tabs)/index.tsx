import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { useAuth } from "@/context/auth";
import { useAlerts } from "@/hooks/useAlerts";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useAuth();

  const {
    alerts: currentAlerts,
    isLoading,
    loadAlertsInitial,
    handleRefresh,
    handleAlertDeleted,
    handleAlertCompleted,
  } = useAlerts(user?.id, {
    includeCompleted: false, // Não inclui alertas concluídos na tela principal
    includeOverdue: true, // Inclui alertas vencidos
    autoUpdateOverdue: true, // Atualiza automaticamente alertas vencidos
    readOnly: false, // Modo interativo
  });

  useFocusEffect(
    useCallback(() => {
      loadAlertsInitial();
      return () => {};
    }, [loadAlertsInitial])
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

      <View className="flex-1 relative gap-5">
        <AlertList
          alerts={currentAlerts}
          onAlertPress={handleAlertPress}
          isLoading={isLoading}
          onAlertDeleted={handleAlertDeleted}
          onAlertCompleted={handleAlertCompleted}
          onRefresh={handleRefresh}
          readOnly={false}
        />
      </View>
    </SafeAreaView>
  );
}
