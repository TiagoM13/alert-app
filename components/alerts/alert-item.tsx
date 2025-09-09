import { Theme } from "@/constants";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Alert, AlertStatus } from "./types";

interface AlertItemProps {
  alert: Alert;
  onPress?: (id: string) => void;
  onDeleteRequest?: (id: string) => void;
  onCompleteRequest: (id: string) => void;
  index?: number;
  resetSwipe?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY_THRESHOLD = 400;
const HORIZONTAL_PADDING = 16;

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

const getStatusStyles = (status: AlertStatus) => {
  switch (status) {
    case "completed":
      return { text: "Completed", color: Theme.colors.success };
    case "overdue":
      return { text: "Overdue", color: Theme.colors.alert };
    case "pending":
    default:
      return { text: "Pending", color: Theme.colors.warning };
  }
};

export const AlertItem: React.FC<AlertItemProps> = ({
  alert,
  onPress,
  onDeleteRequest,
  onCompleteRequest,
  resetSwipe = false,
}) => {
  const timeAgo = formatDistanceToNow(new Date(alert?.createdAt!), {
    addSuffix: true,
  });
  const color = getColorByType(alert.type);

  // Valores compartilhados para animação
  const translateX = useSharedValue(0);
  const isSwipeActive = useRef(false);

  const animatedItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedDeleteButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD * 0.5, -SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: opacity,
      right: -HORIZONTAL_PADDING,
    };
  });

  const animatedCompleteButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: opacity,
      left: -HORIZONTAL_PADDING,
    };
  });

  const panResponder = PanResponder.create({
    // Fase 1: Decidir se deve capturar o gesto
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Só captura se for movimento claramente horizontal
      // E se já tiver movimento mínimo
      if (absX > 10 || absY > 10) {
        const isHorizontal = absX > absY * 1.5;
        return isHorizontal;
      }

      return false; // Não captura micro-movimentos
    },

    // NOVO: Também captura em start se já estivermos em um swipe ativo
    onStartShouldSetPanResponder: () => {
      return isSwipeActive.current;
    },

    // Fase 2: Confirmar captura (chamado após onMoveShouldSetPanResponder retornar true)
    onPanResponderGrant: () => {
      isSwipeActive.current = true;
    },

    // CHAVE: Manter controle exclusivo uma vez que o swipe começou
    onPanResponderTerminationRequest: () => {
      // Se o swipe está ativo, NÃO permite que outros componentes roubem o gesto
      return !isSwipeActive.current;
    },

    // Fase 3: Processar movimento
    onPanResponderMove: (evt, gestureState) => {
      if (isSwipeActive.current) {
        translateX.value = gestureState.dx;
      }
    },

    // Fase 4: Finalizar gesto
    onPanResponderRelease: (evt, gestureState) => {
      if (!isSwipeActive.current) return;

      const { dx, vx } = gestureState;

      const shouldDelete =
        dx < -SWIPE_THRESHOLD || vx < -SWIPE_VELOCITY_THRESHOLD / 1000;
      const shouldComplete =
        dx > SWIPE_THRESHOLD || vx > SWIPE_VELOCITY_THRESHOLD / 1000;

      if (shouldDelete && onDeleteRequest) {
        translateX.value = withTiming(-SCREEN_WIDTH, {}, () => {
          runOnJS(onDeleteRequest)(alert.id);
        });
      } else if (shouldComplete) {
        translateX.value = withTiming(SCREEN_WIDTH, {}, () => {
          runOnJS(onCompleteRequest)(alert.id);
        });
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
          mass: 0.8,
        });
      }

      isSwipeActive.current = false;
    },

    // Libera o gesto se outro componente precisar
    onPanResponderTerminate: () => {
      if (isSwipeActive.current) {
        translateX.value = withSpring(0);
        isSwipeActive.current = false;
      }
    },
  });

  useEffect(() => {
    if (resetSwipe && translateX.value !== 0) {
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
      isSwipeActive.current = false;
    }
  }, [resetSwipe, translateX]);

  const statusStyles = getStatusStyles(alert.status);

  return (
    <View>
      {/* Botões de fundo */}
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

      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.completeButtonBackground,
          animatedCompleteButtonStyle,
        ]}
      >
        <MaterialIcons name="done" size={24} color="white" />
        <Text style={styles.completeButtonText}>Complete</Text>
      </Animated.View>

      {/* Item principal com PanResponder */}
      <Animated.View style={[animatedItemStyle]} {...panResponder.panHandlers}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onPress?.(alert.id)}
          style={styles.touchable}
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
              <View className="flex-row gap-4 items-center">
                <Text className="text-lg font-semibold" style={{ color }}>
                  {alert.type}
                </Text>

                <View className="flex-row items-center gap-2">
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: statusStyles.color,
                    }}
                  />
                  <Text
                    className="text-sm font-medium"
                    style={{ color: statusStyles.color }}
                  >
                    {statusStyles.text}
                  </Text>
                </View>
              </View>
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
    </View>
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
  completeButtonBackground: {
    backgroundColor: Theme.colors.success,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  touchable: {
    padding: 0,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  completeButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
});
