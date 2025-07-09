import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { FloatingButton } from "@/components/floating-button";
import { router } from "expo-router";
import React from "react";
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
  const [selectedTab, setSelectedTab] = React.useState<Tabs>(Tabs.All);

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="History"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View className="flex-1 relative px-4 gap-2">
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

        <AlertList />
        <FloatingButton onPress={handleAddAlert} />
      </View>
    </SafeAreaView>
  );
}
