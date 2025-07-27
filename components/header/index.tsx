import { Theme } from "@/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderComponentProps {
  title?: string;
  onBellPress?: () => void;
  onUserAvatarPress?: () => void;
}

export const Header: React.FC<HeaderComponentProps> = ({
  title = "",
  onBellPress,
  onUserAvatarPress,
}) => {
  return (
    <View className="flex-row justify-between items-center px-5 py-[15px] border border-cardBackground bg-transparent">
      <Text className="text-black text-3xl font-semibold">{title}</Text>

      <View className="flex flex-row items-center gap-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBellPress}
          className="p-1"
        >
          <Ionicons
            name="notifications"
            size={Theme.font.iconSize}
            color={Theme.colors.iconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onUserAvatarPress}
          className="w-10 h-10 rounded-full bg-cardBackground items-center justify-center overflow-hidden"
        >
          <FontAwesome
            name="user"
            size={Theme.font.userIconSize}
            color={Theme.colors.iconColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
