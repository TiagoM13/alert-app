import { Theme } from "@/constants";
import { Octicons, SimpleLineIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileMenuItemProps {
  onPress: () => void;
  iconName: keyof typeof Octicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  onPress,
  iconName,
  iconColor,
  iconBg,
  title,
  description,
}) => {
  return (
    <View className="pt-6 -mx-2">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="p-2 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-4">
          <View
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{ backgroundColor: iconBg }}
          >
            <Octicons name={iconName} size={20} color={iconColor} />
          </View>
          <View>
            <Text className="text-lg font-semibold">{title}</Text>
            <Text className="text-base font-light">{description}</Text>
          </View>
        </View>

        <SimpleLineIcons
          name="arrow-right"
          size={20}
          color={Theme.colors.iconColor}
        />
      </TouchableOpacity>
    </View>
  );
};
