import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Theme } from "@/constants";
import { Alert } from "./types";

interface NotificationItemProps {
  alert: Alert;
}

const getColorByType = (type: Alert["type"]) => {
  switch (type) {
    case "Emergency":
      return Theme.colors.alert;
    case "Warning":
      return Theme.colors.warning;
    case "Information":
      return Theme.colors.success;
    default:
      return Theme.colors.textLabel;
  }
};

export const AlertItem: React.FC<NotificationItemProps> = ({ alert }) => {
  const timeAgo = formatDistanceToNow(new Date(alert.createdAt), {
    addSuffix: true,
  });
  const color = getColorByType(alert.type);

  return (
    <View
      className="p-4 rounded-2xl justify-center gap-1.5 border-r border-b"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: color,
        borderRightColor: "rgba(0,0,0,0.08)",
        borderBottomColor: "rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold" style={{ color }}>
          {alert.type}
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <SimpleLineIcons
            name="arrow-right"
            size={16}
            color={Theme.colors.textLabel}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text className="text-xl font-bold">{alert.title}</Text>

      {/* Message */}
      <Text
        className="text-lg font-normal text-textDescription"
        numberOfLines={1}
      >
        {alert.message}
      </Text>

      {/* Footer */}
      <View className="flex-row items-center gap-1.5 mt-1">
        <MaterialIcons
          name="location-on"
          size={16}
          color={Theme.colors.textLabel}
        />
        <Text className="text-sm text-textLabel">Downtown District</Text>
        <SimpleLineIcons
          name="clock"
          size={12}
          color={Theme.colors.textLabel}
        />
        <Text className="text-sm text-textLabel">{timeAgo}</Text>
      </View>
    </View>
  );
};
