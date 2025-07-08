import { Header } from "@/components";
import { router } from "expo-router";
import { SafeAreaView } from "react-native";

export default function History() {
  const handleBellPress = () => {
    console.log("Sino pressionado!");
    // Navegar para a tela de notificações, etc.
  };

  const handleUserAvatarPress = () => {
    console.log("Avatar do usuário pressionado!");
    // Navegar para o perfil do usuário, etc.
    router.push("/profile");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="History"
        onBellPress={handleBellPress}
        onUserAvatarPress={handleUserAvatarPress}
      />
    </SafeAreaView>
  );
}
