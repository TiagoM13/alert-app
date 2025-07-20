import { InputText } from "@/components/_ui/InputText";
import { Theme } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 mt-16">
        <View className="flex-1">
          <View className="items-center justify-center mb-4">
            <View className="bg-primary rounded-full w-32 h-32 justify-center items-center mb-4 p-4">
              <MaterialIcons name="notifications" size={36} color="white" />
            </View>
            <Text className="text-black text-3xl font-bold">AlertApp</Text>
          </View>

          <Text className="text-black font-semibold text-center text-xl mt-2">
            Stay informed with real-time alerts
          </Text>

          <View className="flex-1 mt-6">
            <InputText
              leftIcon={
                <MaterialIcons
                  name="email"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Email Address"
              placeholder="Enter your email"
            />
            <InputText
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Password"
              secureTextEntry
              placeholder="Enter your password"
              onLeftIconPress={() => {}}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-primary rounded-full p-4 mt-4"
              onPress={handleLogin}
            >
              <Text className="text-white text-xl text-center font-semibold">
                Login
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center justify-center mt-4">
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-primary text-xl">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-center mt-4 mb-4 pb-4">
              <View className="w-32 h-0.5 bg-cardBackground" />
              <Text className="text-black text-xl text-center mx-4">
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
                    <Text className="text-black text-xl">Google</Text>
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
                    <Text className="text-black text-xl">Apple</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-black text-xl">
              Don&apos;t have an account?
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/create-login")}
            >
              <Text className="text-primary font-bold text-lg"> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
