import {
  checkAndUpdateOverdueAlerts,
  getBackgroundSyncStatus,
  registerBackgroundSync,
  unregisterBackgroundSync,
} from "@/services";
import { useCallback, useState } from "react";

interface SyncResult {
  success: boolean;
  message: string;
  updatedCount: number;
}

interface BackgroundSyncStatus {
  isRegistered: boolean;
  status: any;
  statusText: string;
}

interface UseBackgroundSyncReturn {
  isLoading: boolean;
  lastSyncResult: SyncResult | null;
  syncStatus: BackgroundSyncStatus | null;
  manualSync: (userId: string) => Promise<void>;
  checkSyncStatus: () => Promise<void>;
  enableBackgroundSync: () => Promise<void>;
  disableBackgroundSync: () => Promise<void>;
}

export const useBackgroundSync = (): UseBackgroundSyncReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [syncStatus, setSyncStatus] = useState<BackgroundSyncStatus | null>(
    null
  );

  // Sincronização manual
  const manualSync = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      console.log("🔄 Iniciando sincronização manual...");
      const result = await checkAndUpdateOverdueAlerts(userId);
      setLastSyncResult(result as SyncResult);
      console.log("✅ Sincronização manual concluída:", result);
    } catch (error) {
      console.error("❌ Erro na sincronização manual:", error);
      setLastSyncResult({
        success: false,
        message: `Erro: ${error}`,
        updatedCount: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar status do background sync
  const checkSyncStatus = useCallback(async () => {
    try {
      const status = await getBackgroundSyncStatus();
      setSyncStatus(status);
      console.log("📊 Status do background sync:", status);
    } catch (error) {
      console.error("❌ Erro ao verificar status:", error);
    }
  }, []);

  // Habilitar background sync
  const enableBackgroundSync = useCallback(async () => {
    try {
      await registerBackgroundSync();
      await checkSyncStatus();
      console.log("✅ Background sync habilitado");
    } catch (error) {
      console.error("❌ Erro ao habilitar background sync:", error);
    }
  }, [checkSyncStatus]);

  // Desabilitar background sync
  const disableBackgroundSync = useCallback(async () => {
    try {
      await unregisterBackgroundSync();
      await checkSyncStatus();
      console.log("🚫 Background sync desabilitado");
    } catch (error) {
      console.error("❌ Erro ao desabilitar background sync:", error);
    }
  }, [checkSyncStatus]);

  return {
    isLoading,
    lastSyncResult,
    syncStatus,
    manualSync,
    checkSyncStatus,
    enableBackgroundSync,
    disableBackgroundSync,
  };
};
