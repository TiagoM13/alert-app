import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useAuth } from "@/context/auth";
import { useAlerts } from "@/hooks/useAlerts";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

enum Tabs {
  All = "All",
  Emergency = "Emergency",
  Warning = "Warning",
  Information = "Information",
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
  const [selectedTab, setSelectedTab] = React.useState<Tabs>(Tabs.All);
  const { user } = useAuth();

  const {
    alerts: historyAlerts,
    isLoading,
    loadAlertsInitial,
    handleRefresh,
  } = useAlerts(user?.id, {
    includeCompleted: true, // Inclui alertas concluídos no histórico
    includeOverdue: true, // Inclui alertas vencidos no histórico
    autoUpdateOverdue: false, // Não atualiza automaticamente no histórico
    readOnly: true,
  });

  // Filtrar alertas baseado no TIPO selecionado
  const filteredAlerts = useMemo(() => {
    if (!historyAlerts) return [];

    switch (selectedTab) {
      case Tabs.All:
        return historyAlerts;
      case Tabs.Emergency:
        return historyAlerts.filter((alert) => alert.type === "Emergency");
      case Tabs.Warning:
        return historyAlerts.filter((alert) => alert.type === "Warning");
      case Tabs.Information:
        return historyAlerts.filter((alert) => alert.type === "Information");
      default:
        return historyAlerts;
    }
  }, [historyAlerts, selectedTab]);

  // Contar alertas por tipo para mostrar nos badges (opcional)
  const alertCounts = useMemo(() => {
    if (!historyAlerts)
      return { all: 0, emergency: 0, warning: 0, information: 0 };

    return {
      all: historyAlerts.length,
      emergency: historyAlerts.filter((alert) => alert.type === "Emergency")
        .length,
      warning: historyAlerts.filter((alert) => alert.type === "Warning").length,
      information: historyAlerts.filter((alert) => alert.type === "Information")
        .length,
    };
  }, [historyAlerts]);

  useFocusEffect(
    useCallback(() => {
      loadAlertsInitial();
      return () => {};
    }, [loadAlertsInitial])
  );

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

  // Função para obter a contagem baseada no tipo de aba
  const getCountForTab = (tabValue: Tabs): number => {
    switch (tabValue) {
      case Tabs.All:
        return alertCounts.all;
      case Tabs.Emergency:
        return alertCounts.emergency;
      case Tabs.Warning:
        return alertCounts.warning;
      case Tabs.Information:
        return alertCounts.information;
      default:
        return 0;
    }
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
              {tabs.map((tab) => {
                const count = getCountForTab(tab.value);

                return (
                  <AnimatedPressable
                    key={tab.value}
                    onPress={() => handleTabPress(tab.value)}
                    entering={FadeIn.duration(500)}
                    exiting={FadeOut.duration(500)}
                    className={`px-4 py-2 rounded-3xl justify-center items-center transition-all duration-500 ease-in-out ${
                      selectedTab === tab.value ? "bg-primary" : "bg-gray-100"
                    }`}
                  >
                    <View className="flex-row items-center gap-2">
                      <Text
                        className={`text-base font-medium ${
                          selectedTab === tab.value
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {tab.label}
                      </Text>
                      {/* Badge com contagem (opcional) */}
                      {count > 0 && (
                        <View
                          className={`px-2 py-0.5 rounded-full min-w-[20px] items-center justify-center ${
                            selectedTab === tab.value
                              ? "bg-white bg-opacity-20"
                              : "bg-gray-300"
                          }`}
                        >
                          <Text className={`text-xs font-bold text-gray-600`}>
                            {count}
                          </Text>
                        </View>
                      )}
                    </View>
                  </AnimatedPressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        <AlertList
          alerts={filteredAlerts}
          isLoading={isLoading}
          onAlertPress={handleAlertPress}
          onRefresh={handleRefresh}
          readOnly
        />
      </View>
    </SafeAreaView>
  );
}
