import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { Alert } from "@/components/alerts/types";
import { useAuth } from "@/context/auth";
import { fetchAlerts } from "@/database/database";
import { useFocusEffect } from "@react-navigation/native";
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

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!user) return;
      const data = await fetchAlerts(user.id);
      setAllAlerts(data);
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
        />
      </View>
    </SafeAreaView>
  );
}
