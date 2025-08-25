import { Theme } from "@/constants";
import { deleteAlert } from "@/database/database";
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
}

export function AlertList({
  alerts,
  isLoading,
  onAlertPress,
  onAlertDeleted,
}: AlertListProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  const handleDeleteRequest = (id: string) => {
    setAlertToDelete(id);
    setModalVisible(true);
    setSwipedItemId(id);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setAlertToDelete(null);
    setSwipedItemId(null);
  };

  const handleConfirmDelete = async () => {
    if (alertToDelete) {
      try {
        await deleteAlert(alertToDelete);
        setModalVisible(false);
        setAlertToDelete(null);
        setSwipedItemId(null);
        if (onAlertDeleted) {
          onAlertDeleted(alertToDelete);
        }
      } catch (error) {
        console.error("Erro ao deletar o alerta:", error);
      }
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
      resetSwipe={swipedItemId === item.id}
      index={index}
    />
  );

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
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
      <ConfirmationModal
        isVisible={modalVisible}
        message="Tem certeza que deseja deletar este alerta?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
}
