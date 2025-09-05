import { Theme } from "@/constants";
import { deleteAlert, updateAlertStatus } from "@/database/database";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ConfirmationModal } from "../modal/confirmation-modal";
import { AlertItem } from "./alert-item";
import { Alert } from "./types";

interface AlertListProps {
  alerts: Alert[];
  isLoading?: boolean;
  onAlertPress?: (id: string) => void;
  onAlertDeleted?: (id: string) => void;
  onAlertCompleted?: (id: string) => void;
}

export function AlertList({
  alerts,
  isLoading,
  onAlertPress,
  onAlertDeleted,
  onAlertCompleted,
}: AlertListProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "complete">("delete");
  const [alertToHandle, setAlertToHandle] = useState<string | null>(null);
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  const handleCompleteRequest = (id: string) => {
    setAlertToHandle(id);
    setModalType("complete");
    setModalVisible(true);
    setSwipedItemId(id);
  };

  const handleDeleteRequest = (id: string) => {
    setAlertToHandle(id);
    setModalType("delete");
    setModalVisible(true);
    setSwipedItemId(id);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setAlertToHandle(null);
    setSwipedItemId(null);
  };

  const handleConfirm = async () => {
    if (!alertToHandle) return;

    try {
      if (modalType === "delete") {
        await deleteAlert(alertToHandle);
        if (onAlertDeleted) {
          onAlertDeleted(alertToHandle);
        }
      } else if (modalType === "complete") {
        await updateAlertStatus(alertToHandle, "completed");
        if (onAlertCompleted) {
          onAlertCompleted(alertToHandle);
        }
      }
      handleCancel();
    } catch (error) {
      console.error(`Erro ao lidar com a ação ${modalType} do alerta:`, error);
    }
  };

  const renderNotificationItem = ({
    item,
    index,
  }: {
    item: Alert;
    index: number;
  }) => (
    <AlertItem
      alert={item}
      onPress={onAlertPress}
      onDeleteRequest={handleDeleteRequest}
      onCompleteRequest={handleCompleteRequest}
      resetSwipe={swipedItemId === item.id}
      index={index}
    />
  );

  const modalMessage =
    modalType === "delete"
      ? "Tem certeza que deseja deletar este alerta?"
      : "Tem certeza que deseja marcar este alerta como concluído?";

  return (
    <View className="flex-1">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : alerts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No alerts found</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            gap: 16,
            paddingVertical: 10,
            paddingBottom: 80,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
      <ConfirmationModal
        isVisible={modalVisible}
        message={modalMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
}
