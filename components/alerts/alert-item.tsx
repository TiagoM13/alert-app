import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Theme } from "@/constants";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Alert } from "./types";

interface AlertItemProps {
  alert: Alert;
  onPress?: (id: string) => void;
  index?: number;
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

export const AlertItem: React.FC<AlertItemProps> = ({
  alert,
  onPress,
  index,
}) => {
  const timeAgo = formatDistanceToNow(new Date(alert?.createdAt!), {
    addSuffix: true,
  });
  const color = getColorByType(alert.type);

  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    const delay = index! * 100;
    const timeoutId = setTimeout(() => {
      translateY.value = withTiming(0, { duration: 400 });
      opacity.value = withTiming(1, { duration: 400 });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={[animatedStyle, { flex: 1 }]}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => onPress?.(alert.id)}>
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

            <SimpleLineIcons
              name="arrow-right"
              size={16}
              color={Theme.colors.textLabel}
            />
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
            {alert.location && (
              <>
                <MaterialIcons
                  name="location-on"
                  size={16}
                  color={Theme.colors.textLabel}
                />
                <Text className="text-sm text-textLabel">{alert.location}</Text>
              </>
            )}
            <SimpleLineIcons
              name="clock"
              size={12}
              color={Theme.colors.textLabel}
            />
            <Text className="text-sm text-textLabel">{timeAgo}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
