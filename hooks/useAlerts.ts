import { Alert } from "@/components/alerts/types";
import { fetchAlerts } from "@/database/database";
import { checkAndUpdateOverdueAlerts } from "@/services";
import { useCallback, useState } from "react";
import { useActiveSync } from "./useActiveSync";

interface UseAlertsOptions {
  includeCompleted?: boolean;
  includeOverdue?: boolean;
  autoUpdateOverdue?: boolean;
  readOnly?: boolean;
}

interface UseAlertsReturn {
  alerts: Alert[];
  isLoading: boolean;
  fetchAndProcessAlerts: () => Promise<void>;
  loadAlertsInitial: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleAlertDeleted: (deletedId: string) => void;
  handleAlertCompleted: (completedId: string) => void;
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  isReadOnly: boolean; // Indica se está em modo somente leitura
}

export const useAlerts = (
  userId: string | undefined,
  options: UseAlertsOptions = {}
): UseAlertsReturn => {
  const {
    includeCompleted = false,
    includeOverdue = true,
    autoUpdateOverdue = true,
    readOnly = false,
  } = options;

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);

  // NOVO: Sync ativo quando app está em uso
  useActiveSync({
    userId,
    intervalMinutes: 2, // Verifica a cada 2 minutos quando ativo
    onSyncComplete: (result) => {
      if (result.success && result.updatedCount > 0) {
        console.log(
          `🔄 ${result.updatedCount} alertas atualizados - recarregando lista`
        );
        setLastSyncTime(Date.now()); // Força re-render
      }
    },
  });

  const fetchAndProcessAlerts = useCallback(async () => {
    if (!userId) return;

    try {
      // Se deve atualizar alertas vencidos automaticamente
      if (autoUpdateOverdue && !readOnly) {
        console.log("🔄 Verificando alertas vencidos via hook...");
        await checkAndUpdateOverdueAlerts(userId);
      }

      // Busca os alertas atualizados
      let data = await fetchAlerts(userId);

      // Filtra alertas baseado nas opções
      let filteredData = data;

      if (!includeCompleted) {
        filteredData = filteredData.filter(
          (alert) => alert.status !== "completed"
        );
      }

      if (!includeOverdue) {
        filteredData = filteredData.filter(
          (alert) => alert.status !== "overdue"
        );
      }

      setAlerts(filteredData);
    } catch (error) {
      console.error("Erro ao processar alertas:", error);
      throw error;
    }
  }, [
    userId,
    includeCompleted,
    includeOverdue,
    autoUpdateOverdue,
    readOnly,
    lastSyncTime,
  ]);

  // Função para loading inicial (com loading geral)
  const loadAlertsInitial = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchAndProcessAlerts();
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndProcessAlerts]);

  // Função para refresh (sem loading geral)
  const handleRefresh = useCallback(async () => {
    try {
      await fetchAndProcessAlerts();
    } catch (error) {
      console.error("Erro ao recarregar alertas:", error);
    }
  }, [fetchAndProcessAlerts]);

  const handleAlertDeleted = useCallback(
    (deletedId: string) => {
      if (readOnly) return;

      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== deletedId)
      );
    },
    [readOnly]
  );

  const handleAlertCompleted = useCallback(
    (completedId: string) => {
      if (readOnly) return;

      setAlerts((prevAlerts) => {
        const newAlerts = prevAlerts.map((alert) =>
          alert.id === completedId ? { ...alert, status: "completed" } : alert
        );

        if (!includeCompleted) {
          return newAlerts.filter(
            (alert) => alert.status !== "completed"
          ) as Alert[];
        }

        return newAlerts as Alert[];
      });
    },
    [includeCompleted, readOnly]
  );

  return {
    alerts,
    isLoading,
    fetchAndProcessAlerts,
    loadAlertsInitial,
    handleRefresh,
    handleAlertDeleted,
    handleAlertCompleted,
    setAlerts,
    isReadOnly: readOnly,
  };
};
