import { ProfileMenuItem } from "@/components/profile-menu-item";
import { Theme } from "@/constants";
import { useAuth } from "@/context/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackButton } from "@/components/back-button";
import { useAlertStats } from "@/hooks/useAlertStats";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { version } from "../package.json";

export default function Profile() {
  const { user, signOut, refreshUser } = useAuth();

  const {
    stats,
    isLoading: statsLoading,
    fetchStats,
  } = useAlertStats(user?.id);

  // NOVO: Hook para background sync
  const {
    isLoading: syncLoading,
    lastSyncResult,
    syncStatus,
    manualSync,
    checkSyncStatus,
  } = useBackgroundSync();

  // Função para teste manual
  const handleManualSync = async () => {
    if (user?.id) {
      await manualSync(user.id);
      await fetchStats(); // Atualiza as estatísticas após sync
    }
  };

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
      fetchStats();
      checkSyncStatus();
      return () => {};
    }, [refreshUser, fetchStats, checkSyncStatus])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      {/* Header */}
      <View className="flex-row justify-between items-center py-4 px-6 border-b border-cardBackground">
        <BackButton />

        <Text className="text-black text-[24px] font-semibold">Profile</Text>
        <Text className="text-2xl text-center"></Text>
      </View>

      <ScrollView className="flex-1">
        <View className="flex-1 pt-6">
          <View className="p-6 items-center px-6">
            <View className="text-lg font-semibold bg-cardBackground rounded-full w-24 h-24 items-center justify-center mb-4">
              <MaterialIcons
                name="person"
                size={45}
                color={Theme.colors.iconColor}
              />
            </View>

            <View className="items-center">
              <Text className="text-2xl text-textDescription font-bold">
                {user?.fullName || "Nome não disponível"}
              </Text>
              <Text className="text-lg text-textLabel">
                {user?.email || "Email não disponível"}
              </Text>
              {user?.location && (
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="location-sharp"
                    size={16}
                    color={Theme.colors.textLabel}
                  />
                  <Text className="text-lg text-textLabel">
                    {user?.location}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Status */}
          <View className="py-8 flex-row gap-5 justify-center bg-cardBackground/20 px-6">
            <View className="bg-white rounded-lg py-5 px-3 items-center flex-1">
              <Text className="text-primary font-bold text-4xl">
                {statsLoading ? "..." : stats.total}
              </Text>
              <Text className="text-textDescription text-base text-center text-wrap font-medium">
                Alerts Received
              </Text>
            </View>
            <View className="bg-white rounded-lg py-5 px-3 items-center flex-1">
              <Text className="text-success font-bold text-4xl">
                {statsLoading ? "..." : stats.completed}
              </Text>
              <Text className="text-textDescription text-base text-center text-wrap font-medium">
                Resolved
              </Text>
            </View>
            <View className="bg-white rounded-lg py-5 px-3 items-center flex-1">
              <Text className="text-warning font-bold text-4xl">
                {statsLoading ? "..." : stats.pending + stats.overdue}
              </Text>
              <Text className="text-textDescription text-base text-center text-wrap font-medium">
                Active
              </Text>
            </View>
          </View>

          {/* Debug/Test Section - Remova em produção */}
          <View className="px-10 mt-6">
            <Text className="text-xl text-textDescription font-semibold mb-4">
              SYNC DEBUG
            </Text>

            <TouchableOpacity
              onPress={handleManualSync}
              disabled={syncLoading}
              className="bg-blue-500 p-3 rounded-lg mb-2"
            >
              <Text className="text-white text-center">
                {syncLoading ? "Sincronizando..." : "Sincronização Manual"}
              </Text>
            </TouchableOpacity>

            {lastSyncResult && (
              <Text
                className={`text-sm ${lastSyncResult.success ? "text-green-600" : "text-red-600"}`}
              >
                {lastSyncResult.message}
              </Text>
            )}

            {syncStatus && (
              <Text className="text-sm text-gray-600">
                Background Sync: {syncStatus.isRegistered ? "Ativo" : "Inativo"}
                ({syncStatus.statusText})
              </Text>
            )}
          </View>

          {/* Settings */}
          <View className="px-10 mt-6">
            <Text className="text-xl text-textDescription font-semibold">
              PERSONAL
            </Text>

            <ProfileMenuItem
              onPress={() => {}}
              iconName="person-fill"
              iconColor={Theme.colors.primary}
              iconBg={"rgba(33 150 243 / 0.1)"}
              title="Edit Profile"
              description="Update your personal details"
            />

            <ProfileMenuItem
              onPress={() => {}}
              iconName="bell-fill"
              iconColor={Theme.colors.success}
              iconBg={"rgba(76 175 80 / 0.1)"}
              title="Notification Settings"
              description="Manage alert preferences"
            />

            <ProfileMenuItem
              onPress={() => {}}
              iconName="location"
              iconColor={Theme.colors.warning}
              iconBg={"rgba(255 184 77 / 0.1)"}
              title="Location Services"
              description="Manage location access"
            />
          </View>

          <View className="px-10 mt-6">
            <Text className="text-xl text-textDescription font-semibold">
              SUPPORT
            </Text>

            <ProfileMenuItem
              onPress={() => {}}
              iconName="question"
              iconColor={"#a855f7"}
              iconBg={"rgba(168 85 247 / 0.1)"}
              title="Help Center"
              description="FAQs and support"
            />

            <ProfileMenuItem
              onPress={() => {}}
              iconName="shield-lock"
              iconColor={Theme.colors.textDescription}
              iconBg={"rgba(75 85 99 / 0.1)"}
              title="Privacy Policy"
              description="How we protect your data"
            />

            <ProfileMenuItem
              onPress={handleSignOut}
              iconName="sign-out"
              iconColor={Theme.colors.alert}
              iconBg={"rgba(255 68 68 / 0.1)"}
              title="Sign Out"
              description="Logout from your account"
            />
          </View>

          <View className="items-center text-textDescription/10 justify-center px-6 py-4 mt-8">
            <Text className="text-textLabel font-medium">
              AlertApp v{version}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
