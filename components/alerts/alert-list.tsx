import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { AlertItem } from "./alert-item";
import { Alert } from "./types";

interface AlertListProps {
  alerts: Alert[];
  isLoading?: boolean;
}

export function AlertList({ alerts, isLoading }: AlertListProps) {
  const renderNotificationItem = ({ item }: { item: Alert }) => (
    <AlertItem alert={item} />
  );

  return (
    <View className="flex-1">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
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
