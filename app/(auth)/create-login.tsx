import { InputText } from "@/components/_ui/InputText";
import { Theme } from "@/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function CreateLogin() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        <View className="flex-1">
          <View className="flex-row items-center mt-4 gap-4">
            <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
              <Octicons name="arrow-left" size={24} color="black" />
            </TouchableOpacity>

            <Text className="text-black text-[24px] font-semibold">
              Create Account
            </Text>
          </View>

          <Text className="text-xl font-semibold my-4">
            Join AlertApp to stay information
          </Text>

          <View className="flex-1 mt-4">
            <InputText
              leftIcon={
                <MaterialIcons
                  name="person"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Full Name"
              placeholder="Enter your full name"
            />
            <InputText
              leftIcon={
                <MaterialIcons
                  name="email"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Email"
              placeholder="Enter your email"
            />
            <InputText
              leftIcon={
                <MaterialIcons
                  name="phone"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Phone Number"
              placeholder="Enter your phone number"
            />
            <InputText
              leftIcon={
                <MaterialIcons
                  name="location-on"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Location"
              placeholder="Enter your city/region"
            />
            <InputText
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Password"
              secureTextEntry
              placeholder="Enter your password"
              onLeftIconPress={() => {}}
            />
            <InputText
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              secureTextEntry
              label="Confirm Password"
              placeholder="Enter your password"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-primary rounded-full p-4"
          >
            <Text className="text-white text-xl text-center font-bold">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
