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

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Perfil</Text>
      </View>
    </>
  );
}
