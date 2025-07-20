import React from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { twMerge } from "tailwind-merge";

type InputTextProps = {
  name?: string;
  control?: any;
  label?: string;
  errorMessage?: string;
} & TextInputProps;

export const InputText: React.FC<InputTextProps> = ({
  name,
  control,
  placeholder,
  secureTextEntry = false,
  label,
  errorMessage,
  ...rest
}) => {
  const renderInput = (
    value: string,
    onChange: (text: string) => void,
    onBlur?: () => void,
    error?: any
  ) => (
    <>
      <TextInput
        className={twMerge(
          "border-2 rounded-md p-3 bg-white placeholder:text-gray-400 text-lg transition-all duration-300 ease-in-out",
          error ? "border-alert" : "border-gray-200",
          rest.className
        )}
        placeholder={placeholder}
        onChangeText={onChange}
        value={value}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
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
