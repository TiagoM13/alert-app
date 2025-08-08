import { Theme } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { twMerge } from "tailwind-merge";

export const FloatingButton: React.FC<
  React.ComponentPropsWithoutRef<typeof Pressable>
> = ({ className, ...props }) => {
  return (
    <Pressable
      onPress={() => router.push("/register")}
      className={twMerge(
        "absolute -top-7 w-[65px] h-[65px] bg-primary rounded-full justify-center items-center shadow-md",
        className
      )}
      style={{
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
      }}
      {...props}
    >
      <Ionicons name="add" size={40} color={Theme.colors.white} />
    </Pressable>
  );
};
