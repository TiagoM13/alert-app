import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 justify-center items-center">
        <Text>This screen does not exist.</Text>
        <Link href="/" className="mt-15 py-15">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
