import { fetchAlerts, updateAlertStatus } from "@/database/database";
import { format, parseISO } from "date-fns";

export const checkAndUpdateOverdueAlerts = async (userId: string) => {
  try {
    const alerts = await fetchAlerts(userId);

    const potentialOverdueAlerts = alerts.filter((alert) => {
      return alert.scheduledAt && alert.status === "pending";
    });

    const overdueAlerts = potentialOverdueAlerts.filter((alert) => {
      const scheduledAtWithoutZ = alert.scheduledAt!.replace("Z", "");
      const scheduledAtLocal = parseISO(scheduledAtWithoutZ);
      const scheduledAtLocalISO = format(
        scheduledAtLocal,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );

      const nowLocal = new Date();
      const nowLocalISO = format(nowLocal, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

      return nowLocalISO > scheduledAtLocalISO;
    });

    if (overdueAlerts.length > 0) {
      await Promise.all(
        overdueAlerts.map((alert) => updateAlertStatus(alert.id, "overdue"))
      );

      return {
        success: true,
        message: `${overdueAlerts.length} alertas atualizados para vencidos`,
        updatedCount: overdueAlerts.length,
      };
    }

    return {
      success: true,
      message: "Nenhum alerta vencido encontrado",
      updatedCount: 0,
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro: ${error}`,
      updatedCount: 0,
    };
  }
};
