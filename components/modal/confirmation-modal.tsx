import { Theme } from "@/constants";
import React, { useEffect } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ConfirmationModalProps {
  isVisible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = 200;
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  message,
  onCancel,
  onConfirm,
}) => {
  const translateY = useSharedValue(MODAL_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      backdropOpacity.value = withTiming(0.6, { duration: 300 });
    } else {
      translateY.value = withTiming(MODAL_HEIGHT, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible, translateY, backdropOpacity]);

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <Pressable onPress={onCancel} style={StyleSheet.absoluteFillObject}>
          <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
        </Pressable>

        <Animated.View style={[styles.modalContent, animatedModalStyle]}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: Theme.colors.white }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
  },
  modalContent: {
    width: "100%",
    height: MODAL_HEIGHT,
    backgroundColor: Theme.colors.white,
    opacity: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  messageText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: Theme.colors.black,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Theme.colors.cardBackground, // Cinza claro
  },
  confirmButton: {
    backgroundColor: Theme.colors.alert, // Vermelho de alerta
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Theme.colors.black,
  },
});
