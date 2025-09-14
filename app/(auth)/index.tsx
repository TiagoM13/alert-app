import { InputText } from "@/components/_ui/InputText";
import { Theme } from "@/constants";
import { useAuth } from "@/context/auth";
import { findUserByEmail } from "@/database/database";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import z from "zod";

const loginSchema = z.object({
  email: z.email("Formato de e-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const user = await findUserByEmail(data.email);

      if (user && user.password === data.password) {
        await signIn(user.id, user);

        Toast.show({
          type: "success",
          text1: "Login successful",
          text2: `Welcome, ${user.fullName}`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: "Invalid email or password.",
        });
      }
    } catch (error) {
      console.error("Erro no login", error);
      Toast.show({
        type: "error",
        text1: "System Error",
        text2: "Unable to complete login.",
      });
    }
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

          <Text className="text-black text-center text-xl mt-2">
            Stay informed with real-time alerts
          </Text>

          <View className="flex-1 mt-6">
            <InputText
              name="email"
              control={control}
              errorMessage={errors.email?.message}
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
              name="password"
              control={control}
              errorMessage={errors.password?.message}
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Password"
              secureTextEntry
              autoComplete="off"
              textContentType="password"
              placeholder="Enter your password"
            />

            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-primary rounded-full p-4 mt-4"
              onPress={handleSubmit(handleLogin)}
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
              <View className="flex-1 h-0.5 bg-cardBackground" />
              <Text className="text-black text-center mx-4">
                Or continue with
              </Text>
              <View className="flex-1 h-0.5 bg-cardBackground" />
            </View>

            <View className="flex-row items-center gap-4 justify-center">
              <View className="flex-row flex-1 items-center justify-center">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center justify-center"
                >
                  <View className="flex-row items-center justify-center gap-2 bg-white py-3 border border-cardBackground rounded-lg p-2 flex-1">
                    <Ionicons name="logo-google" size={24} color="red" />
                    <Text className="text-black text-xl">Google</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-1 items-center justify-center">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center justify-center"
                >
                  <View className="flex-row items-center justify-center gap-2 bg-white border py-3 border-cardBackground rounded-lg p-2 flex-1">
                    <Ionicons name="logo-apple" size={24} color="black" />
                    <Text className="text-black text-xl">Apple</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-center">
            <Text className="text-black text-lg">
              Don&apos;t have an account?
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/create-login")}
            >
              <Text className="text-primary font-medium text-lg"> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
