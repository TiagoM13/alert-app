import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Profile() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold">Perfil</Text>
      </View>
    </>
  );
}
