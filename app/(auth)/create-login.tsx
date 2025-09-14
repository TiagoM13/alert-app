import { InputText } from "@/components/_ui/InputText";
import { Theme } from "@/constants";
import { useAuth } from "@/context/auth";
import { insertUser } from "@/database/database";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

const createLoginSchema = z
  .object({
    fullName: z.string().min(1, "O nome completo é obrigatório"),
    email: z.email("Formato de e-mail inválido"),
    phoneNumber: z.string().optional(),
    location: z.string().optional(),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type CreateLoginFormData = z.infer<typeof createLoginSchema>;

export default function CreateLogin() {
  const router = useRouter();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLoginSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      phoneNumber: "",
    },
  });

  const handleBack = () => {
    router.back();
  };

  const onSubmit = async (data: CreateLoginFormData) => {
    try {
      const newUser = {
        id: uuidv4(),
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber || "",
        location: data.location || "",
        password: data.password,
      };

      console.log({ newUser });

      await insertUser(newUser);
      console.log("Usuário cadastrado com sucesso!");

      Toast.show({
        type: "success",
        text1: "Account created",
        text2: "You can now log in!",
      });

      router.replace("/(auth)");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: "An error occurred while creating your account.",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        <View className="flex-1">
          <View className="flex-row items-center mt-4 gap-4">
            <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
              <Octicons name="arrow-left" size={24} color="black" />
            </TouchableOpacity>

            <Text className="text-black text-[24px] font-semibold">
              Create Account
            </Text>
          </View>

          <Text className="text-xl my-4">
            Join AlertApp to stay information
          </Text>

          <View className="flex-1 mt-4">
            <InputText
              name="fullName"
              control={control}
              errorMessage={errors.fullName?.message}
              leftIcon={
                <MaterialIcons
                  name="person"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Full Name"
              placeholder="Enter your full name"
              autoFocus
            />
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
              label="Email"
              placeholder="Enter your email"
            />
            <InputText
              name="phoneNumber"
              control={control}
              errorMessage={errors.phoneNumber?.message}
              leftIcon={
                <MaterialIcons
                  name="phone"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Phone Number"
              placeholder="Enter your phone number"
            />
            <InputText
              name="location"
              control={control}
              errorMessage={errors.location?.message}
              leftIcon={
                <MaterialIcons
                  name="location-on"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              label="Location"
              placeholder="Enter your city/region"
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
              showPasswordToggle
              textContentType="newPassword"
              placeholder="Enter your password"
              autoComplete="off"
            />
            <InputText
              name="confirmPassword"
              control={control}
              errorMessage={errors.confirmPassword?.message}
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={Theme.colors.textLabel}
                />
              }
              showPasswordToggle
              secureTextEntry
              textContentType="none"
              label="Confirm Password"
              placeholder="Enter your password"
              autoComplete="off"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.7}
            className="bg-primary rounded-full p-4"
          >
            <Text className="text-white text-xl text-center font-bold">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
