import { Theme } from "@/constants";
import React from "react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";

type SelectTypeOption = {
  label: string;
};

interface SelectTypeProps<T extends FieldValues = FieldValues>
  extends Omit<ControllerProps<T>, "name" | "control" | "render"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options?: SelectTypeOption[];
  colors?: Record<string, string>;
  errorMessage?: string;
  className?: string;
}

const defaultOptions: SelectTypeOption[] = [
  { label: "Emergency" },
  { label: "Warning" },
  { label: "Information" },
];

const defaultColors: Record<string, string> = {
  Emergency: Theme.colors.alert,
  Warning: Theme.colors.warning,
  Information: Theme.colors.success,
};

export const SelectType = <T extends FieldValues = FieldValues>({
  name,
  control,
  label = "Select Alert Type",
  options = defaultOptions,
  colors = defaultColors,
  errorMessage,
  className,
}: SelectTypeProps<T>) => {
  return (
    <View className={twMerge("gap-2", className)}>
      {label ? <Text className="text-lg font-medium mb-2">{label}</Text> : null}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <View className="gap-2">
              {options.map((button) => (
                <TouchableOpacity
                  key={button.label}
                  activeOpacity={0.7}
                  className={twMerge(
                    "flex-row items-center gap-2 border-2 rounded-xl p-4"
                  )}
                  style={{
                    borderColor:
                      value === button.label ? colors[button.label] : "#e5e7eb",
                  }}
                  onPress={() => onChange(button.label)}
                >
                  <View
                    style={{
                      borderColor: colors[button.label],
                    }}
                    className={twMerge("w-8 h-8 border-2 p-1 rounded-full")}
                  >
                    <View
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundColor:
                          value === button.label
                            ? colors[button.label]
                            : "transparent",
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors[button.label],
                    }}
                    className={twMerge("text-lg font-medium")}
                  >
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {(error || errorMessage) && (
              <Text className="text-red-500 text-sm mt-1">
                {error?.message || errorMessage}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};

export default SelectType;
