import { addMinutes, parseISO } from "date-fns";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return false;
    }

    if (Platform.OS === "android") {
      await setupAndroidChannel();
    }

    return true;
  } catch (error) {
    console.error("❌ Erro ao solicitar permissões:", error);
    return false;
  }
};

const setupAndroidChannel = async () => {
  try {
    await Notifications.setNotificationChannelAsync("alerts", {
      name: "Alertas",
      description: "Notificações de alertas vencidos",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
      enableVibrate: true,
      enableLights: true,
      showBadge: true,
    });
  } catch (error) {
    console.error("❌ Erro ao configurar canal Android:", error);
  }
};

export const scheduleOverdueNotification = async (
  alertId: string,
  alertTitle: string,
  scheduledAt: string
): Promise<string | null> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      return null;
    }

    const scheduledAtWithoutZ = scheduledAt.replace("Z", "");
    const scheduledAtLocal = parseISO(scheduledAtWithoutZ);

    const now = new Date();
    if (scheduledAtLocal <= now) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Alerta Vencido",
        body: `O alerta "${alertTitle}" venceu e precisa de atenção`,
        data: {
          type: "overdue_alert",
          alertId: alertId,
          scheduledFor: scheduledAt,
        },
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledAtLocal,
      },
    });

    console.log(
      `📅 Notificação agendada: ${alertTitle} - ID: ${notificationId}`
    );
    return notificationId;
  } catch (error) {
    console.error("❌ Erro ao agendar notificação:", error);
    return null;
  }
};

export const scheduleReminderNotification = async (
  alertId: string,
  alertTitle: string,
  scheduledAt: string,
  minutesBefore: number = 15
): Promise<string | null> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return null;

    const scheduledAtWithoutZ = scheduledAt.replace("Z", "");
    const scheduledAtLocal = parseISO(scheduledAtWithoutZ);
    const reminderTime = addMinutes(scheduledAtLocal, -minutesBefore);

    const now = new Date();
    if (reminderTime <= now) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔔 Lembrete de Alerta",
        body: `O alerta "${alertTitle}" vence em ${minutesBefore} minutos`,
        data: {
          type: "reminder_alert",
          alertId: alertId,
          minutesBefore: minutesBefore,
        },
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderTime,
      },
    });

    console.log(`⏰ Lembrete agendado: ${alertTitle} - ID: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error("❌ Erro ao agendar lembrete:", error);
    return null;
  }
};

export const cancelScheduledNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("❌ Erro ao cancelar notificação:", error);
  }
};

export const listScheduledNotifications = async () => {
  try {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error("❌ Erro ao listar notificações:", error);
    return [];
  }
};

export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("❌ Erro ao cancelar notificações:", error);
  }
};

export const testNotification = async () => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧪 Teste de Notificação",
        body: "Se você está vendo isso, as notificações estão funcionando!",
        data: { type: "test" },
        sound: "default",
      },
      trigger: null,
    });

    return true;
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};
