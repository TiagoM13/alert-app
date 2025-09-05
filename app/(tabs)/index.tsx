import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { Alert } from "@/components/alerts/types";
import { useAuth } from "@/context/auth";
import { fetchAlerts, updateAlertStatus } from "@/database/database";
import { useFocusEffect } from "@react-navigation/native";
import { isAfter } from "date-fns";
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
      let data = await fetchAlerts(user.id);

      const overdueUpdates = data.filter(
        (alert) =>
          alert.scheduledAt &&
          alert.status === "pending" &&
          isAfter(new Date(), alert.scheduledAt)
      );

      if (overdueUpdates.length > 0) {
        await Promise.all(
          overdueUpdates.map((alert) => updateAlertStatus(alert.id, "overdue"))
        );
        data = await fetchAlerts(user.id);
      }

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

  const handleAlertCompleted = (completedId: string) => {
    setCurrentAlerts((prevAlerts) => {
      // Atualiza o status do alerta no estado local
      const newAlerts = prevAlerts.map((alert) =>
        alert.id === completedId ? { ...alert, status: "completed" } : alert
      );
      // Filtra os alertas "concluídos" para que não apareçam mais na lista principal
      return newAlerts as Alert[];
    });
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
        />
      </View>
    </SafeAreaView>
  );
}
