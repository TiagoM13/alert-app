import { InputText } from "@/components/_ui/InputText";
import { InputTextarea } from "@/components/_ui/InputTextarea";
import { Theme } from "@/constants";
import Octicons from "@expo/vector-icons/Octicons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

const buttons = [
  {
    label: "Emergency",
  },
  {
    label: "Warning",
  },
  {
    label: "Information",
  },
];

const colors: Record<string, string> = {
  Emergency: Theme.colors.alert,
  Warning: Theme.colors.warning,
  Information: Theme.colors.success,
};

const priorityOptions = [
  {
    label: "Low",
  },
  {
    label: "Medium",
  },
  {
    label: "High",
  },
];

export default function Profile() {
  const [selectedButton, setSelectedButton] = useState<string>("Emergency");
  const [selectedPriority, setSelectedPriority] = useState<string>("Low");

  const handleCreateAlert = () => {
    console.log("create alert");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-1 px-6">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
            <Octicons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-2xl text-center">Add Alert</Text>
          <Text className="text-2xl text-center"></Text>
        </View>

        <ScrollView
          className="flex-1 py-4 gap-4 mt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 60,
          }}
        >
          <Text className="text-lg font-medium mb-2">Select Alert Type</Text>

          <View className="gap-2">
            {buttons.map((button) => (
              <TouchableOpacity
                key={button.label}
                activeOpacity={0.7}
                className={twMerge(
                  "flex-row items-center gap-2 border-2 rounded-xl p-4"
                )}
                style={{
                  borderColor:
                    selectedButton === button.label
                      ? colors[button.label]
                      : "#e5e7eb",
                }}
                onPress={() => setSelectedButton(button.label)}
              >
                <View
                  style={{
                    borderColor: colors[button.label],
                  }}
                  className={twMerge("w-8 h-8 border-2 p-1 rounded-full")}
                >
                  <View
                    className="w-full h-full rounded-full"
                    style={{
                      backgroundColor:
                        selectedButton === button.label
                          ? colors[button.label]
                          : "transparent",
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: colors[button.label],
                  }}
                  className={twMerge("text-lg font-medium")}
                >
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="gap-2 space-y-4 mt-6">
            <InputText label="Title" placeholder="Enter alert title" />
            <InputTextarea
              label="Description"
              placeholder="Enter detailed description..."
            />
            <InputText
              label="Location (Optional)"
              placeholder="Enter location"
            />

            <View className="gap-2">
              <Text className="text-lg font-medium">Priority Level</Text>
              <View className="flex-row items-center gap-2">
                {priorityOptions.map((level) => (
                  <TouchableOpacity
                    key={level.label}
                    activeOpacity={0.7}
                    onPress={() => setSelectedPriority(level.label)}
                    className="gap-2 border-2 items-center justify-center rounded-xl px-4 py-2.5 flex-1"
                    style={{
                      borderColor:
                        selectedPriority === level.label
                          ? "rgba(59, 130, 246, 0.5)"
                          : "rgba(0, 0, 0, 0.05)",
                      backgroundColor:
                        selectedPriority === level.label
                          ? "rgba(59, 130, 246, 0.1)"
                          : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          selectedPriority === level.label
                            ? "rgba(59, 130, 246, 1)"
                            : "#000000",
                      }}
                      className="text-base font-medium"
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-2 mt-10">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBack}
                className="flex-1 border-2 border-gray-200 rounded-xl p-4"
              >
                <Text className="text-center text-base font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCreateAlert}
                className="flex-1 bg-primary rounded-xl p-4"
              >
                <Text className="text-center text-base text-white font-semibold">
                  Create Alert
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
