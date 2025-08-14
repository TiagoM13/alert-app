import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async (userId: string) => {
    await AsyncStorage.setItem("userSessionId", userId);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("userSessionId");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const userSessionId = await AsyncStorage.getItem("userSessionId");
      if (userSessionId) {
        setIsAuthenticated(!!userSessionId);
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
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
