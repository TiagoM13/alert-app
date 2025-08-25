import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

interface BackButtonProps {
  onBackFn?: () => void;
}
export const BackButton: React.FC<BackButtonProps> = ({ onBackFn }) => {
  const handleBack = () => {
    router.back();
    onBackFn?.();
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
      <Octicons name="arrow-left" size={24} color="black" />
    </TouchableOpacity>
  );
};
