import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { alerts } from "@/database/alerts";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

enum Tabs {
  All = "All",
  Emergency = "Emergency",
  Warning = "Warning",
  Info = "Info",
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
    value: Tabs.Info,
  },
];

export default function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = React.useState<Tabs>(Tabs.All);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (selectedTab === Tabs.All) return true;
      return alert.type === selectedTab;
    });
  }, [selectedTab]);

  const handleTabPress = (tab: Tabs) => {
    setSelectedTab(tab);
  };

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
        title="History"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View className="flex-1 relative px-6 gap-2">
        {!isLoading && (
          <View className="py-2">
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

        <AlertList alerts={filteredAlerts} isLoading={isLoading} />
      </View>
    </SafeAreaView>
  );
}
