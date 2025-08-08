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

type InputTextareaProps = {
  name?: string;
  control?: any;
  label?: string;
  leftIcon?: React.ReactNode;
  errorMessage?: string;
} & TextInputProps;

export const InputTextarea: React.FC<InputTextareaProps> = ({
  name,
  control,
  placeholder,
  label,
  leftIcon,
  errorMessage,
  ...rest
}) => {
  const renderInput = (
    value: string,
    onChange: (text: string) => void,
    onBlur?: () => void,
    error?: any
  ) => (
    <View className="relative">
      <TextInput
        className={twMerge(
          "border-2 rounded-xl text-lg px-3 py-4 bg-white h-44 text-justify placeholder:text-gray-400 transition-all duration-300",
          error ? "border-alert" : "border-gray-200",
          leftIcon ? "pl-12" : "",
          rest.className
        )}
        multiline
        textAlignVertical="center"
        placeholderTextColor={"#6B7280"}
        placeholder={placeholder}
        onChangeText={onChange}
        style={[{ lineHeight: 20 }]}
        value={value}
        {...rest}
      />

      {leftIcon && (
        <TouchableOpacity className="absolute left-3 top-7 -translate-y-1/2">
          <View className="w-6 h-6 items-center justify-center">
            {leftIcon}
          </View>
        </TouchableOpacity>
      )}

      {error && (
        <Text style={{ color: "red", marginTop: 4, fontSize: 12 }}>
          {error.message || errorMessage || "Este campo é obrigatório"}
        </Text>
      )}
    </View>
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
