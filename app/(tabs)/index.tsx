import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { FloatingButton } from "@/components/floating-button";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function Home() {
  const handleBellPress = () => {
    console.log("Sino pressionado!");
    // Navegar para a tela de notificações, etc.
  };

  const handleUserAvatarPress = () => {
    console.log("Avatar do usuário pressionado!");
    // Navegar para o perfil do usuário, etc.
    router.push("/profile");
  };

  const handleAddAlert = () => {
    // abrir modal, navegar para tela de criação, etc.
    console.log("Adicionar novo alerta");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Alerts"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View style={styles.content}>
        <AlertList />

        <FloatingButton onPress={handleAddAlert} />
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
    position: "relative",
    flex: 1,
    paddingHorizontal: 16,
    gap: 20,
  },
});
