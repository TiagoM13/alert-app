import { InputText } from "@/components/_ui/InputText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 mt-16">
        <View className="flex-1">
          <Text className="text-black text-5xl font-bold text-center">
            AlertApp
          </Text>

          <Text className="text-black text-center text-xl mt-2">
            Stay informed with real-time alerts
          </Text>

          <View className="flex-1 mt-6">
            <InputText label="Email Address" placeholder="Enter your email" />
            <InputText label="Password" placeholder="Enter your password" />

            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-primary rounded-full p-4 mt-4"
            >
              <Text className="text-white text-xl text-center font-semibold">
                Login
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center justify-center mt-4">
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-primary text-lg">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-center mt-4 mb-4 pb-4">
              <View className="w-32 h-0.5 bg-cardBackground" />
              <Text className="text-black text-lg text-center mx-4">
                Or continue with
              </Text>
              <View className="w-32 h-0.5 bg-cardBackground" />
            </View>

            <View className="flex-row items-center justify-center mt-4">
              <View className="flex-row items-center justify-center mr-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center justify-center"
                >
                  <View className="flex-row items-center justify-center gap-2 bg-white py-3 border border-cardBackground rounded-lg p-2 w-52">
                    <Ionicons name="logo-google" size={24} color="red" />{" "}
                    <Text className="text-black">Google</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-center ml-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center justify-center"
                >
                  <View className="flex-row items-center justify-center gap-2 bg-white border py-3 border-cardBackground rounded-lg p-2 w-52">
                    <Ionicons name="logo-apple" size={24} color="black" />
                    <Text className="text-black">Apple</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-black text-lg">
              Don&apos;t have an account?
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/create-login")}
            >
              <Text className="text-primary text-lg"> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
