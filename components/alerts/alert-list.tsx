import { Theme } from "@/constants";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { AlertItem } from "./alert-item";
import { Alert } from "./types";

interface AlertListProps {
  alerts: Alert[];
  isLoading?: boolean;
  onAlertPress?: (id: string) => void;
}

export function AlertList({ alerts, isLoading, onAlertPress }: AlertListProps) {
  const renderNotificationItem = ({
    item,
    index,
  }: {
    item: Alert;
    index: number;
  }) => <AlertItem alert={item} onPress={onAlertPress} index={index} />;

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
    </View>
  );
}
