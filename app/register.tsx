import { Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-1 justify-center items-center">
        <View className="justify-center items-center">
          <TouchableOpacity>
            <Text>Click</Text>
          </TouchableOpacity>
          <Text>teste</Text>
        </View>
        <Text className="text-2xl font-bold">Add Alert</Text>
      </View>
    </SafeAreaView>
  );
}
