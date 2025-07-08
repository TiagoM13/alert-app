import { Theme } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";

export const FloatingButton: React.FC<
  React.ComponentPropsWithoutRef<typeof TouchableOpacity>
> = ({ className, ...props }) => {
  return (
    <TouchableOpacity
      className={twMerge(
        "absolute bottom-20 right-5 w-[60px] h-[60px] rounded-full",
        "bg-primary items-center justify-center",
        "shadow-lg shadow-black/20 elevation-5",
        className
      )}
      {...props}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={28} color={Theme.colors.white} />
    </TouchableOpacity>
  );
};
