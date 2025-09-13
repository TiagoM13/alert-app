import { findUserById } from "@/database/database";
import { registerBackgroundSync, unregisterBackgroundSync } from "@/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  user: User | null;
  signIn: (userId: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isLoading: true,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  setUser: () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async (userId: string, userData: User) => {
    await AsyncStorage.setItem("userSessionId", userId);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);

    // Após login bem-sucedido, salve o userId e registre background sync
    if (user) {
      await AsyncStorage.setItem("currentUserId", user.id);
      await registerBackgroundSync();
      console.log("✅ Background sync registrado após login");
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("userSessionId");
    await AsyncStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser(null);

    // Cancela background sync antes de fazer logout
    await unregisterBackgroundSync();
    await AsyncStorage.removeItem("currentUserId");
  };

  const handleSetUser = (userData: User) => {
    setUser(userData);
  };

  const refreshUser = useCallback(async () => {
    const userSessionId = await AsyncStorage.getItem("userSessionId");
    if (userSessionId) {
      try {
        const freshUser = await findUserById(userSessionId);
        if (freshUser) {
          setUser(freshUser);
          await AsyncStorage.setItem("userData", JSON.stringify(freshUser));
        }
      } catch (error) {
        console.error("Erro ao atualizar dados do usuário:", error);
      }
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const userSessionId = await AsyncStorage.getItem("userSessionId");
      const userDataString = await AsyncStorage.getItem("userData");

      if (userSessionId && userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setIsAuthenticated(true);
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signOut,
        setUser: handleSetUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
