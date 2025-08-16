import { InputText } from "@/components/_ui/InputText";
import { InputTextarea } from "@/components/_ui/InputTextarea";
import { Alert, AlertType } from "@/components/alerts/types";
import { Theme } from "@/constants";
import { fetchAlertById, insertAlert, updateAlert } from "@/database/database";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const alertSchema = z.object({
  alertType: z.string().min(1, "Selecione um tipo de alerta"),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título muito longo"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(500, "Descrição muito longa"),
  location: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
});

type AlertFormData = z.infer<typeof alertSchema>;

const buttons = [
  {
    label: "Emergency",
  },
  {
    label: "Warning",
  },
  {
    label: "Information",
  },
];

const colors: Record<string, string> = {
  Emergency: Theme.colors.alert,
  Warning: Theme.colors.warning,
  Information: Theme.colors.success,
};

const priorityOptions = [
  {
    label: "Low",
  },
  {
    label: "Medium",
  },
  {
    label: "High",
  },
];

// const defaultValues = {
//   alertType: "Emergency",
//   title: "",
//   description: "",
//   location: "",
//   priority: "Low",
// };
export default function Regiter() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  console.log({ id });

  const [loadingAlert, setLoadingAlert] = useState(isEditing);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      alertType: "Emergency",
      title: "",
      description: "",
      location: "",
      priority: "Low",
    },
  });

  console.log({ errors });

  const onSubmit = async (data: AlertFormData) => {
    try {
      if (isEditing && typeof id === "string") {
        const updatedAlert: Alert = {
          id: id,
          title: data.title,
          message: data.description,
          type: data.alertType as AlertType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          location: data.location || "",
        };
        await updateAlert(updatedAlert);
        console.log("Alerta atualizado no banco de dados:", updatedAlert);
        router.push("/(tabs)");
        reset();
      } else {
        const newAlert: Alert = {
          id: uuidv4(),
          title: data.title,
          message: data.description,
          type: data.alertType as AlertType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          location: data.location || "",
        };
        await insertAlert(newAlert);
        console.log("Alerta salvo no banco de dados:", newAlert);
        reset();
        router.push("/(tabs)");
      }
    } catch (error) {
      console.error("Erro ao salvar/atualizar alerta:", error);
    }
  };

  const handleBack = () => {
    router.back();
    reset();
  };

  useEffect(() => {
    const loadAlertData = async () => {
      if (isEditing && typeof id === "string") {
        setLoadingAlert(true);

        setTimeout(async () => {
          try {
            const existingAlert = await fetchAlertById(id);
            if (existingAlert) {
              setValue("alertType", existingAlert.type);
              setValue("title", existingAlert.title);
              setValue("description", existingAlert.message);
              setValue("location", existingAlert.location || "");
              // Exemplo: setValue("priority", existingAlert.priority || "Low");
            } else {
              console.warn("Alerta não encontrado para edição:", id);
              router.replace("/(tabs)");
            }
          } catch (error) {
            console.error("Erro ao carregar alerta para edição:", error);
            router.replace("/(tabs)");
          } finally {
            setLoadingAlert(false);
          }
        }, 2000);
      } else {
        setLoadingAlert(false);
      }
    };

    loadAlertData();
  }, [id, isEditing, setValue]);

  if (loadingAlert) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text className="mt-4 text-lg text-gray-600">Loading Alert...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView
        className="flex-1 px-6"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
            <Octicons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-black text-[24px] font-semibold">
            Add Alert
          </Text>
          <Text className="text-2xl text-center"></Text>
        </View>

        <ScrollView
          className="flex-1 py-4 gap-4 mt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
          }}
        >
          <Text className="text-lg font-medium mb-2">Select Alert Type</Text>

          {/* Alert Type Selection */}
          <Controller
            control={control}
            name="alertType"
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                {buttons.map((button) => (
                  <TouchableOpacity
                    key={button.label}
                    activeOpacity={0.7}
                    className={twMerge(
                      "flex-row items-center gap-2 border-2 rounded-xl p-4"
                    )}
                    style={{
                      borderColor:
                        value === button.label
                          ? colors[button.label]
                          : "#e5e7eb",
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
            )}
          />
          {errors.alertType && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.alertType.message}
            </Text>
          )}

          <View className="gap-2 space-y-4 mt-6">
            {/* Title Input */}
            <InputText
              name="title"
              control={control}
              label="Title"
              placeholder="Enter alert title"
              errorMessage={errors.title?.message}
              leftIcon={
                <Entypo name="text" size={24} color={Theme.colors.textLabel} />
              }
            />

            {/* Description Input */}
            <InputTextarea
              name="description"
              control={control}
              label="Description"
              placeholder="Enter detailed description..."
              errorMessage={errors.description?.message}
              leftIcon={
                <Entypo name="text" size={24} color={Theme.colors.textLabel} />
              }
            />

            {/* Location Input */}
            <InputText
              name="location"
              control={control}
              label="Location (Optional)"
              placeholder="Enter location"
              errorMessage={errors.location?.message}
              leftIcon={
                <Ionicons
                  name="location-sharp"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
            />

            {/* Priority Selection */}
            <View className="gap-2">
              <Text className="text-lg font-medium">Priority Level</Text>
              <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center gap-2">
                    {priorityOptions.map((level) => (
                      <TouchableOpacity
                        key={level.label}
                        activeOpacity={0.7}
                        onPress={() => onChange(level.label)}
                        className="gap-2 border-2 items-center justify-center rounded-xl px-4 py-2.5 flex-1"
                        style={{
                          borderColor:
                            value === level.label
                              ? "rgba(59, 130, 246, 0.5)"
                              : "rgba(0, 0, 0, 0.05)",
                          backgroundColor:
                            value === level.label
                              ? "rgba(59, 130, 246, 0.1)"
                              : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            color:
                              value === level.label
                                ? "rgba(59, 130, 246, 1)"
                                : "#000000",
                          }}
                          className="text-lg font-medium"
                        >
                          {level.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors.priority && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.priority.message}
                </Text>
              )}
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between gap-2 mt-10 mb-10">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBack}
                className="flex-1 border-2 border-gray-200 rounded-xl p-4"
              >
                <Text className="text-center text-lg font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSubmit(onSubmit)}
                className="flex-1 bg-primary rounded-xl p-4"
              >
                <Text className="text-center text-lg text-white font-semibold">
                  <Text className="text-center text-lg text-white font-semibold">
                    {isEditing ? "Update Alert" : "Create Alert"}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
