import { checkAndUpdateOverdueAlerts } from "@/services";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

interface UseActiveSyncOptions {
  userId?: string;
  intervalMinutes?: number; // Intervalo em minutos quando app está ativo
  onSyncComplete?: (result: any) => void;
}

export const useActiveSync = ({
  userId,
  intervalMinutes = 5, // A cada 5 minutos quando ativo
  onSyncComplete,
}: UseActiveSyncOptions): {
  startInterval: () => void;
  stopInterval: () => void;
} => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // @ts-expect-error ignore
    intervalRef.current = setInterval(
      async () => {
        if (userId && appStateRef.current === "active") {
          console.log("🔄 Verificação periódica (app ativo)...");
          try {
            const result = await checkAndUpdateOverdueAlerts(userId);
            onSyncComplete?.(result);
            console.log("✅ Verificação periódica concluída:", result);
          } catch (error) {
            console.error("❌ Erro na verificação periódica:", error);
          }
        }
      },
      intervalMinutes * 60 * 1000
    ); // Converte minutos para millisegundos
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Listener para estado do app
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      appStateRef.current = nextAppState;

      if (nextAppState === "active") {
        console.log("📱 App ativo - iniciando verificações periódicas");
        startInterval();
        // Verificação imediata ao ganhar foco
        checkAndUpdateOverdueAlerts(userId).then(onSyncComplete);
      } else {
        console.log("📱 App em background - parando verificações periódicas");
        stopInterval();
      }
    };

    // Inicia se o app já estiver ativo
    if (AppState.currentState === "active") {
      startInterval();
    }

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      stopInterval();
      subscription?.remove();
    };
  }, [userId, intervalMinutes]);

  return {
    startInterval,
    stopInterval,
  };
};
