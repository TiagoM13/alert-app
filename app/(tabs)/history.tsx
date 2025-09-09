import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { Alert } from "@/components/alerts/types";
import { useAuth } from "@/context/auth";
import { fetchAlerts, updateAlertStatus } from "@/database/database";
import { useFocusEffect } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

enum Tabs {
  All = "All",
  Emergency = "Emergency",
  Warning = "Warning",
  Information = "Information", // Renomeado de 'Info' para 'Information' para corresponder ao tipo AlertType
}

const tabs = [
  {
    label: "All",
    value: Tabs.All,
  },
  {
    label: "Emergency",
    value: Tabs.Emergency,
  },
  {
    label: "Warning",
    value: Tabs.Warning,
  },
  {
    label: "Info",
    value: Tabs.Information,
  },
];

export default function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = React.useState<Tabs>(Tabs.All);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const { user } = useAuth();

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

    setAllAlerts(data);
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

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((alert) => {
      if (selectedTab === Tabs.All) return true;
      return alert.type === selectedTab;
    });
  }, [selectedTab, allAlerts]);

  const handleTabPress = (tab: Tabs) => {
    setSelectedTab(tab);
  };

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
    setAllAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== deletedId)
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="History"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View className="flex-1 relative gap-2">
        {!isLoading && (
          <View className="py-2 px-6">
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                alignItems: "center",
                gap: 14,
              }}
            >
              {tabs.map((tab) => (
                <AnimatedPressable
                  key={tab.value}
                  onPress={() => handleTabPress(tab.value)}
                  entering={FadeIn.duration(500)}
                  exiting={FadeOut.duration(500)}
                  className={`px-4 py-2 rounded-3xl justify-center items-center transition-all duration-500 ease-in-out ${
                    selectedTab === tab.value ? "bg-primary" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      selectedTab === tab.value ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {tab.label}
                  </Text>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </View>
        )}

        <AlertList
          alerts={filteredAlerts}
          isLoading={isLoading}
          onAlertPress={handleAlertPress}
          onAlertDeleted={handleAlertDeleted}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
}
