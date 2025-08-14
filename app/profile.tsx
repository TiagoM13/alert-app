import { useAuth } from "@/context/auth";
import { Stack, router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { user, signOut, refreshUser } = useAuth();

  const handleSignOut = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)");
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      refreshUser();
      return () => {};
    }, [refreshUser])
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-blue-600 pt-12 pb-6 px-6">
          <Text className="text-white text-3xl font-bold text-center">
            Perfil
          </Text>
        </View>

        {/* User Info */}
        <View className="flex-1 px-6 pt-8">
          <View className="bg-gray-50 rounded-lg p-6 mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-4">
              Informações do Usuário
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm text-gray-500 mb-1">Nome</Text>
                <Text className="text-lg text-gray-900 font-medium">
                  {user?.fullName || "Nome não disponível"}
                </Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500 mb-1">Email</Text>
                <Text className="text-lg text-gray-900 font-medium">
                  {user?.email || "Email não disponível"}
                </Text>
              </View>

              {user?.phoneNumber && (
                <View>
                  <Text className="text-sm text-gray-500 mb-1">Telefone</Text>
                  <Text className="text-lg text-gray-900 font-medium">
                    {user.phoneNumber}
                  </Text>
                </View>
              )}

              {user?.location && (
                <View>
                  <Text className="text-sm text-gray-500 mb-1">
                    Localização
                  </Text>
                  <Text className="text-lg text-gray-900 font-medium">
                    {user.location}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-500 py-4 rounded-lg"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
