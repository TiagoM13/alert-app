import { addMinutes, parseISO } from "date-fns";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// ✅ Configuração das notificações (mover para cá)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true, // ✅ Ativei o som para alertas importantes
    shouldSetBadge: false,
  }),
});

// ✅ Função para solicitar permissões (movida do notifications.ts)
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    console.log("🔔 Solicitando permissões de notificação...");

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("📋 Status atual das permissões:", existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      console.log("❓ Solicitando permissões...");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("❌ Permissão de notificação negada");
      return false;
    }

    console.log("✅ Permissão de notificação concedida");

    // Configurar canal de notificação (Android)
    if (Platform.OS === "android") {
      await setupAndroidChannel();
    }

    return true;
  } catch (error) {
    console.error("❌ Erro ao solicitar permissões:", error);
    return false;
  }
};

// ✅ Configurar canal para Android
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
    console.log("✅ Canal Android configurado");
  } catch (error) {
    console.error("❌ Erro ao configurar canal Android:", error);
  }
};

// ✅ Função principal para agendar notificação de vencimento
export const scheduleOverdueNotification = async (
  alertId: string,
  alertTitle: string,
  scheduledAt: string
): Promise<string | null> => {
  try {
    console.log(`📅 Agendando notificação para alerta: ${alertTitle}`);

    // Verifica permissões
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      console.log("❌ Sem permissão para agendar notificação");
      return null;
    }

    // Converte o horário como LOCAL
    const scheduledAtWithoutZ = scheduledAt.replace("Z", "");
    const scheduledAtLocal = parseISO(scheduledAtWithoutZ);

    // Verifica se a data é no futuro
    const now = new Date();
    if (scheduledAtLocal <= now) {
      console.log("⚠️ Horário agendado já passou, não agendando notificação");
      return null;
    }

    const diffMinutes = Math.round(
      (scheduledAtLocal.getTime() - now.getTime()) / (1000 * 60)
    );
    console.log(`⏳ Notificação será disparada em ${diffMinutes} minutos`);

    // Agenda notificação para quando o alerta vencer
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

    console.log(`✅ Notificação agendada com ID: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error("❌ Erro ao agendar notificação:", error);
    return null;
  }
};

// ✅ Função para agendar lembrete antes do vencimento
export const scheduleReminderNotification = async (
  alertId: string,
  alertTitle: string,
  scheduledAt: string,
  minutesBefore: number = 15
): Promise<string | null> => {
  try {
    console.log(
      `⏰ Agendando lembrete ${minutesBefore}min antes para: ${alertTitle}`
    );

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return null;

    const scheduledAtWithoutZ = scheduledAt.replace("Z", "");
    const scheduledAtLocal = parseISO(scheduledAtWithoutZ);
    const reminderTime = addMinutes(scheduledAtLocal, -minutesBefore);

    // Só agenda se o lembrete for no futuro
    const now = new Date();
    if (reminderTime <= now) {
      console.log("⚠️ Horário do lembrete já passou, não agendando");
      return null;
    }

    const diffMinutes = Math.round(
      (reminderTime.getTime() - now.getTime()) / (1000 * 60)
    );
    console.log(`⏳ Lembrete será disparado em ${diffMinutes} minutos`);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "�� Lembrete de Alerta",
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

    console.log(`✅ Lembrete agendado com ID: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error("❌ Erro ao agendar lembrete:", error);
    return null;
  }
};

// ✅ Função para cancelar notificação agendada
export const cancelScheduledNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`🗑️ Notificação ${notificationId} cancelada`);
  } catch (error) {
    console.error("❌ Erro ao cancelar notificação:", error);
  }
};

// ✅ Função para listar todas as notificações agendadas
export const listScheduledNotifications = async () => {
  try {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    console.log("�� Notificações agendadas:", notifications.length);

    // Log detalhado para debug
    notifications.forEach((notification, index) => {
      console.log(`📋 ${index + 1}. ID: ${notification.identifier}`);
      console.log(`   Título: ${notification.content.title}`);
      console.log(`   Trigger: ${notification.trigger}`);
    });

    return notifications;
  } catch (error) {
    console.error("❌ Erro ao listar notificações:", error);
    return [];
  }
};

// ✅ Função para cancelar todas as notificações
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("🗑️ Todas as notificações canceladas");
  } catch (error) {
    console.error("❌ Erro ao cancelar notificações:", error);
  }
};

// ✅ Função para testar notificação (útil para debug)
export const testNotification = async () => {
  try {
    console.log("🧪 Enviando notificação de teste...");

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log("❌ Sem permissão para teste");
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧪 Teste de Notificação",
        body: "Se você está vendo isso, as notificações estão funcionando!",
        data: { type: "test" },
        sound: "default",
      },
      trigger: null, // Imediato
    });

    console.log("✅ Notificação de teste enviada");
    return true;
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};
