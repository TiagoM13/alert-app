import { updateAlertStatus } from "@/database/database";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export const useNotificationListener = (onAlertStatusChanged?: () => void) => {
  useEffect(() => {
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        const { data } = notification.request.content;

        if (data?.type === "overdue_alert" && data?.alertId) {
          console.log("🔔 Notificação recebida - Atualizando status do alerta");

          try {
            await updateAlertStatus(data.alertId as string, "overdue");
            onAlertStatusChanged?.();
          } catch (error) {
            console.error("❌ Erro ao atualizar status:", error);
          }
        }
      });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const { data } = response.notification.request.content;

          if (data?.type === "overdue_alert" && data?.alertId) {
            try {
              await updateAlertStatus(data.alertId as string, "overdue");
              onAlertStatusChanged?.();
            } catch (error) {
              console.error("❌ Erro ao atualizar status:", error);
            }
          }
        }
      );

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, [onAlertStatusChanged]);
};
