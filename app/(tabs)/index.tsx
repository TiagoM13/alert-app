import { Header } from "@/components";
import { NotificationItem } from "@/components/notifications/notification";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function CreateAlertScreen() {
  const handleBellPress = () => {
    console.log("Sino pressionado!");
    // Navegar para a tela de notificações, etc.
  };

  const handleUserAvatarPress = () => {
    console.log("Avatar do usuário pressionado!");
    // Navegar para o perfil do usuário, etc.
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Alerts"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View style={styles.content}>
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    padding: 16,
    gap: 20,
  },
});
