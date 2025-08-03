import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { Theme } from "@/constants";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Alert } from "./types";

interface AlertItemProps {
  alert: Alert;
  onPress?: (id: string) => void;
  onDeleteRequest?: (id: string) => void;
  index?: number;
  resetSwipe?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3; // Define o limite de arraste para a ação de exclusão
const SWIPE_VELOCITY_THRESHOLD = 500; // Limiar de velocidade para o arraste ser considerado forte

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
  onDeleteRequest,
  index = 0,
  resetSwipe = false,
}) => {
  const timeAgo = formatDistanceToNow(new Date(alert?.createdAt!), {
    addSuffix: true,
  });
  const color = getColorByType(alert.type);

  // Valor compartilhado para a animação do arraste
  const translateX = useSharedValue(0);

  const animatedItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedDeleteButtonStyle = useAnimatedStyle(() => {
    // Interpola a opacidade do botão para que ele apareça gradualmente
    const opacity = interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacity,
    };
  });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Permite o arraste apenas para a esquerda
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      // Se o arraste exceder o limite OU a velocidade for alta, dispara a exclusão
      const shouldDelete =
        translateX.value < -SWIPE_THRESHOLD ||
        event.velocityX < -SWIPE_VELOCITY_THRESHOLD;

      if (shouldDelete) {
        // Anima o item para fora da tela e, em seguida, abre o modal
        translateX.value = withTiming(-SCREEN_WIDTH, {}, () => {
          if (onDeleteRequest) {
            runOnJS(onDeleteRequest)(alert.id);
          }
        });
      } else {
        // Retorna o item à sua posição original com animação de mola
        translateX.value = withSpring(0);
      }
    });

  useEffect(() => {
    if (resetSwipe && translateX.value !== 0) {
      translateX.value = withSpring(0);
    }
  }, [resetSwipe, translateX]);

  return (
    // Usa FadeInDown para a animação de entrada, que é mais robusta
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <View>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.deleteButtonBackground,
            animatedDeleteButtonStyle,
          ]}
        >
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[animatedItemStyle]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPress?.(alert.id)}
            >
              <View
                className="p-4 rounded-2xl justify-center gap-1.5 border-r border-b"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: color,
                  borderRightColor: "rgba(0,0,0,0.08)",
                  borderBottomColor: "rgba(0,0,0,0.08)",
                  backgroundColor: Theme.colors.white,
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
                      <Text className="text-sm text-textLabel">
                        {alert.location}
                      </Text>
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
        </GestureDetector>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  deleteButtonBackground: {
    backgroundColor: Theme.colors.alert,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
});
