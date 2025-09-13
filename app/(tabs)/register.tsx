import { InputText } from "@/components/_ui/InputText";
import { InputTextarea } from "@/components/_ui/InputTextarea";
import { SelectType } from "@/components/_ui/SelectType";
import { Alert, AlertPriority, AlertType } from "@/components/alerts/types";
import { BackButton } from "@/components/back-button";
import { Theme } from "@/constants";
import { useAuth } from "@/context/auth";
import {
  fetchAlertById,
  insertAlert,
  updateAlert,
  updateAlertNotificationIds,
} from "@/database/database";
import {
  cancelScheduledNotification,
  scheduleOverdueNotification,
  scheduleReminderNotification,
} from "@/services/scheduledNotifications";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Switch from "react-native-switch-toggle";
import Toast from "react-native-toast-message";

import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const alertSchema = z
  .object({
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
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
  })
  .refine(
    (data) => {
      return true; // Por enquanto, mantém simples
    },
    {
      message: "Data e hora são obrigatórias quando agendamento está ativo",
    }
  );

export type AlertFormData = z.infer<typeof alertSchema>;

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

// Função helper para agendar notificações
const scheduleNotificationsForAlert = async (
  alert: Alert
): Promise<{
  notificationId?: string;
  reminderNotificationId?: string;
}> => {
  const notifications: {
    notificationId?: string;
    reminderNotificationId?: string;
  } = {};

  if (alert.scheduledAt && alert.status === "pending") {
    try {
      console.log("📅 Agendando notificações para alerta:", alert.title);

      // Agenda notificação de vencimento
      const notificationId = await scheduleOverdueNotification(
        alert.id,
        alert.title,
        alert.scheduledAt
      );

      if (notificationId) {
        notifications.notificationId = notificationId;
        console.log("✅ Notificação de vencimento agendada:", notificationId);
      }

      // Agenda lembrete 15 minutos antes
      const reminderNotificationId = await scheduleReminderNotification(
        alert.id,
        alert.title,
        alert.scheduledAt,
        15 // 15 minutos antes
      );

      if (reminderNotificationId) {
        notifications.reminderNotificationId = reminderNotificationId;
        console.log("✅ Lembrete agendado:", reminderNotificationId);
      }
    } catch (error) {
      console.error("❌ Erro ao agendar notificações:", error);
    }
  }

  return notifications;
};

// Função helper para cancelar notificações antigas
const cancelOldNotifications = async (alertId: string) => {
  try {
    const existingAlert = await fetchAlertById(alertId);

    if (existingAlert?.notificationId) {
      await cancelScheduledNotification(existingAlert.notificationId);
      console.log(
        "🗑️ Notificação antiga cancelada:",
        existingAlert.notificationId
      );
    }

    if (existingAlert?.reminderNotificationId) {
      await cancelScheduledNotification(existingAlert.reminderNotificationId);
      console.log(
        "🗑️ Lembrete antigo cancelado:",
        existingAlert.reminderNotificationId
      );
    }
  } catch (error) {
    console.error("❌ Erro ao cancelar notificações antigas:", error);
  }
};

export default function Regiter() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;
  const { user } = useAuth();

  const [loadingAlert, setLoadingAlert] = useState(isEditing);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [notificationsScheduled, setNotificationsScheduled] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      alertType: "Emergency",
      title: "",
      description: "",
      location: "",
      priority: "Low",
      scheduledDate: "",
      scheduledTime: "",
    },
  });

  const scheduledDate = watch("scheduledDate");
  const scheduledTime = watch("scheduledTime");

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date: Date) => {
    setValue("scheduledDate", format(date, "yyyy-MM-dd"));
    hideDatePicker();
  };

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);
  const handleConfirmTime = (time: Date) => {
    setValue("scheduledTime", format(time, "HH:mm"));
    hideTimePicker();
  };

  console.log({ errors });

  const onSubmit = async (data: AlertFormData) => {
    if (!user) {
      console.error("Erro: Usuário não está logado.");
      return;
    }

    try {
      if (isEditing && typeof id === "string") {
        // === MODO EDIÇÃO ===

        // 1. Cancela notificações antigas primeiro
        await cancelOldNotifications(id);

        // 2. Cria o alerta atualizado
        const updatedAlert: Alert = {
          id: id,
          userId: user.id,
          title: data.title,
          message: data.description,
          type: data.alertType as AlertType,
          priority: data.priority as AlertPriority,
          createdAt: new Date().toISOString(), // Você pode manter a data original se quiser
          updatedAt: new Date().toISOString(),
          location: data.location || "",
          scheduledAt: isScheduled
            ? `${data.scheduledDate}T${data.scheduledTime}:00Z`
            : undefined,
          status: "pending",
        };

        // 3. Atualiza o alerta no banco
        await updateAlert(updatedAlert);
        console.log("✅ Alerta atualizado no banco de dados:", updatedAlert);

        // 4. Agenda novas notificações se necessário
        const notifications = await scheduleNotificationsForAlert(updatedAlert);

        // 5. Salva os IDs das notificações no banco
        if (
          notifications.notificationId ||
          notifications.reminderNotificationId
        ) {
          await updateAlertNotificationIds(
            updatedAlert.id,
            notifications.notificationId,
            notifications.reminderNotificationId
          );
          console.log("✅ IDs de notificação atualizados");
        }

        router.push("/(tabs)");
        reset();

        Toast.show({
          type: "success",
          text1: "Alert updated successfully!",
          text2: notifications.notificationId
            ? "Alert updated and notifications scheduled"
            : "Alert updated successfully",
          visibilityTime: 3000,
          autoHide: true,
        });
      } else {
        // === MODO CRIAÇÃO ===

        // 1. Cria o novo alerta
        const newAlert: Alert = {
          id: uuidv4(),
          userId: user.id,
          title: data.title,
          message: data.description,
          type: data.alertType as AlertType,
          priority: data.priority as AlertPriority,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          location: data.location || "",
          scheduledAt: isScheduled
            ? `${data.scheduledDate}T${data.scheduledTime}:00Z`
            : undefined,
          status: "pending",
        };

        // 2. Salva o alerta no banco
        await insertAlert(newAlert);
        console.log("✅ Alerta salvo no banco de dados:", newAlert);

        // 3. Agenda notificações se necessário
        const notifications = await scheduleNotificationsForAlert(newAlert);

        // 4. Salva os IDs das notificações no banco
        if (
          notifications.notificationId ||
          notifications.reminderNotificationId
        ) {
          await updateAlertNotificationIds(
            newAlert.id,
            notifications.notificationId,
            notifications.reminderNotificationId
          );
          console.log("✅ IDs de notificação salvos");
        }

        reset();
        router.push("/(tabs)");

        Toast.show({
          type: "success",
          text1: "Alert created successfully!",
          text2: notifications.notificationId
            ? "Alert created and notifications scheduled"
            : "Alert created successfully",
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (error) {
      const message = isEditing
        ? "Error updating alert"
        : "Error creating alert";

      console.error("Erro ao salvar/atualizar alerta:", error);

      Toast.show({
        type: "error",
        text1: message,
        text2: "Please try again",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleBack = () => {
    router.back();
    reset();
    setIsScheduled(false);
  };

  useEffect(() => {
    const loadAlertData = async () => {
      if (isEditing && typeof id === "string") {
        setLoadingAlert(true);

        try {
          const existingAlert = await fetchAlertById(id);

          if (existingAlert) {
            setValue("alertType", existingAlert.type);
            setValue("title", existingAlert.title);
            setValue("description", existingAlert.message);
            setValue("location", existingAlert.location || "");
            setValue("priority", existingAlert.priority);
            if (existingAlert.scheduledAt) {
              setIsScheduled(true);
              const scheduledDateString = existingAlert.scheduledAt.substring(
                0,
                10
              );
              const scheduledTimeString = existingAlert.scheduledAt.substring(
                11,
                16
              );
              setValue("scheduledDate", scheduledDateString);
              setValue("scheduledTime", scheduledTimeString);
            }
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
          <BackButton
            onBackFn={() => {
              reset();
              setIsScheduled(false);
            }}
          />

          <Text className="text-black text-[24px] font-semibold">
            {isEditing ? "Edit Alert" : "Add Alert"}
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
          <SelectType name="alertType" control={control} />

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

            {/* 2. Toggle "Schedule Alert" */}
            <View className="flex-row items-center justify-between mt-6">
              <Text className="text-lg font-medium">Schedule Alert</Text>
              <Switch
                switchOn={isScheduled}
                onPress={() => setIsScheduled(!isScheduled)}
                circleColorOff={Theme.colors.white}
                circleColorOn={Theme.colors.white}
                backgroundColorOff={Theme.colors.cardBackground}
                backgroundColorOn={Theme.colors.primary}
                containerStyle={{
                  width: 50,
                  height: 28,
                  borderRadius: 25,
                  padding: 2,
                }}
                circleStyle={{
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                }}
              />
            </View>

            {isScheduled && (
              <View className="bg-blue-50 p-3 rounded-lg mt-2">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#3B82F6"
                  />
                  <Text className="text-blue-700 font-medium">
                    Notificações Automáticas
                  </Text>
                </View>
                <Text className="text-blue-600 text-sm mt-1">
                  • Lembrete 15 minutos antes do vencimento
                </Text>
                <Text className="text-blue-600 text-sm">
                  • Notificação quando o alerta vencer
                </Text>
              </View>
            )}

            {/* 3. Inputs de Data e Hora Condicionais */}
            {isScheduled && (
              <View className="gap-4 mt-4">
                <View className="flex-1">
                  <Text className="text-lg font-medium">Date</Text>
                  <TouchableOpacity
                    onPress={showDatePicker}
                    className="flex-row items-center p-4 border rounded-xl border-gray-200 mt-2"
                  >
                    <Text className="flex-1 text-lg text-gray-800">
                      {scheduledDate
                        ? format(parseISO(scheduledDate), "dd/MM/yyyy", {
                            locale: ptBR,
                          })
                        : "dd/mm/yyyy"}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={Theme.colors.textLabel}
                    />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    date={scheduledDate ? new Date(scheduledDate) : new Date()}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-medium">Time</Text>
                  <TouchableOpacity
                    onPress={showTimePicker}
                    className="flex-row items-center p-4 border rounded-xl border-gray-200 mt-2"
                  >
                    <Text className="flex-1 text-lg">
                      {scheduledTime || "--:--"}
                    </Text>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={Theme.colors.textLabel}
                    />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    date={scheduledDate ? new Date(scheduledDate) : new Date()}
                    mode="time"
                    onConfirm={handleConfirmTime}
                    onCancel={hideTimePicker}
                    is24Hour
                  />
                </View>
              </View>
            )}

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
