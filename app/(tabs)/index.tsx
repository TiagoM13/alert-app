import { Header } from "@/components";
import { AlertList } from "@/components/alerts/alert-list";
import { FloatingButton } from "@/components/floating-button";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";

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
    router.push("/register");
    console.log("Adicionar novo alerta");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Alerts"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />

      <View className="flex-1 relative px-4 gap-5">
        <AlertList />
        <FloatingButton onPress={handleAddAlert} />
      </View>
    </SafeAreaView>
  );
}
