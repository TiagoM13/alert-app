import { countAlertsByStatus } from "@/database/database";
import { useCallback, useState } from "react";

interface AlertStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}

interface UseAlertStatsReturn {
  stats: AlertStats;
  isLoading: boolean;
  fetchStats: () => Promise<void>;
}

export const useAlertStats = (
  userId: string | undefined
): UseAlertStatsReturn => {
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const counts = await countAlertsByStatus(userId);
      setStats(counts);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    stats,
    isLoading,
    fetchStats,
  };
};
