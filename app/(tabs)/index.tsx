import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { Alert } from "@/components/alerts/types";
import { useAuth } from "@/context/auth";
import { fetchAlerts, updateAlertStatus } from "@/database/database";
import { useFocusEffect } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);

  const fetchAndProcessAlerts = useCallback(async () => {
    if (!user) return;

    let data = await fetchAlerts(user.id);

    const overdueUpdates = data.filter((alert) => {
      if (!alert.scheduledAt || alert.status !== "pending") return false;

      // Trata o scheduledAt como horário local
      const scheduledAtWithoutZ = alert.scheduledAt.replace("Z", "");
      const scheduledAtLocal = parseISO(scheduledAtWithoutZ);
      const scheduledAtLocalISO = format(
        scheduledAtLocal,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );

      // Hora atual local
      const nowLocal = new Date();
      const nowLocalISO = format(nowLocal, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

      const isOverdue = nowLocalISO > scheduledAtLocalISO;

      return isOverdue;
    });

    if (overdueUpdates.length > 0) {
      await Promise.all(
        overdueUpdates.map((alert) => updateAlertStatus(alert.id, "overdue"))
      );
      data = await fetchAlerts(user.id);
    }

    setCurrentAlerts(data);
  }, [user]);

  // Função para loading inicial (com loading geral)
  const loadAlertsInitial = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchAndProcessAlerts();
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndProcessAlerts]);

  // Função para refresh (sem loading geral)
  const handleRefresh = useCallback(async () => {
    try {
      await fetchAndProcessAlerts();
    } catch (error) {
      console.error("Erro ao recarregar alertas:", error);
    }
  }, [fetchAndProcessAlerts]);

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
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
}
