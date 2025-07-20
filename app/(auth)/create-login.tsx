import { InputText } from "@/components/_ui/InputText";
import { SafeAreaView, Text, View } from "react-native";

export default function CreateLogin() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        <View className="flex-1">
          <Text className="text-black text-[24px] font-semibold">
            Create Login
          </Text>

          <View className="flex-1 mt-4">
            <InputText label="Email" placeholder="Enter your email" />
            <InputText label="Password" placeholder="Enter your password" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
