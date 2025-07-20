import { Theme } from "@/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Controller } from "react-hook-form";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { twMerge } from "tailwind-merge";

type InputTextProps = {
  name?: string;
  control?: any;
  label?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
} & TextInputProps;

export const InputText: React.FC<InputTextProps> = ({
  name,
  control,
  placeholder,
  secureTextEntry = false,
  label,
  errorMessage,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  showPasswordToggle = false,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const hasPasswordToggle = showPasswordToggle || secureTextEntry;
  const shouldShowPassword = hasPasswordToggle && !isPasswordVisible;
  const renderInput = (
    value: string,
    onChange: (text: string) => void,
    onBlur?: () => void,
    error?: any
  ) => (
    <>
      <View className="relative">
        <TextInput
          className={twMerge(
            "border-2 h-16 rounded-xl p-3 bg-white placeholder:text-gray-400 text-lg transition-all duration-300 ease-in-out",
            error ? "border-alert" : "border-gray-200",
            leftIcon ? "pl-12" : "",
            rightIcon || hasPasswordToggle ? "pr-12" : "",
            rest.className
          )}
          placeholder={placeholder}
          onChangeText={onChange}
          value={value}
          secureTextEntry={shouldShowPassword}
          {...rest}
        />

        {leftIcon && (
          <TouchableOpacity
            className="absolute left-3 top-1/2 -translate-y-1/2"
            onPress={onLeftIconPress}
            disabled={!onLeftIconPress}
            activeOpacity={onLeftIconPress ? 0.7 : 1}
          >
            <View className="w-6 h-6 items-center justify-center">
              {leftIcon}
            </View>
          </TouchableOpacity>
        )}

        {(rightIcon || hasPasswordToggle) && (
          <TouchableOpacity
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onPress={
              hasPasswordToggle ? togglePasswordVisibility : onRightIconPress
            }
            disabled={!hasPasswordToggle && !onRightIconPress}
            activeOpacity={hasPasswordToggle || onRightIconPress ? 0.7 : 1}
          >
            <View className="items-center justify-center">
              {hasPasswordToggle ? (
                <View className="items-center justify-center">
                  {isPasswordVisible ? (
                    <MaterialIcons
                      name="visibility"
                      size={24}
                      color={Theme.colors.textLabel}
                    />
                  ) : (
                    <MaterialIcons
                      name="visibility-off"
                      size={24}
                      color={Theme.colors.textLabel}
                    />
                  )}
                </View>
              ) : (
                rightIcon
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={{ color: "red", marginTop: 4, fontSize: 12 }}>
          {error.message || errorMessage || "Este campo é obrigatório"}
        </Text>
      )}
    </>
  );

  return (
    <View className="mb-4">
      {label && <Text className="font-medium text-lg mb-2">{label}</Text>}
      {control && name ? (
        <Controller
          control={control}
          name={name}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => renderInput(value, onChange, onBlur, error)}
        />
      ) : (
        renderInput(rest.value || "", rest.onChangeText || (() => {}))
      )}
    </View>
  );
};
