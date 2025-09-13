// services/notificationListener.ts
import { updateAlertStatus } from "@/database/database";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export const useNotificationListener = (onAlertStatusChanged?: () => void) => {
  useEffect(() => {
    // Listener para notificações recebidas (app em foreground)
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        const { data } = notification.request.content;

        if (data?.type === "overdue_alert" && data?.alertId) {
          console.log(
            "🔔 Notificação de alerta vencido recebida dentro do app"
          );
          console.log(
            `🔄 Atualizando status do alerta ${data.alertId} para overdue`
          );

          try {
            await updateAlertStatus(data.alertId as string, "overdue");
            console.log("✅ Status atualizado em tempo real");

            // Chama callback para atualizar a UI
            onAlertStatusChanged?.();
          } catch (error) {
            console.error("❌ Erro ao atualizar status:", error);
          }
        }
      });

    // Listener para quando usuário interage com notificação
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const { data } = response.notification.request.content;

          if (data?.type === "overdue_alert" && data?.alertId) {
            console.log("👆 Usuário clicou na notificação de alerta vencido");

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
