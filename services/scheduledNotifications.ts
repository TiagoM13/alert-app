import { addMinutes, parseISO } from "date-fns";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ✅ CORRIGIDO: Função que respeita as escolhas do usuário
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    // 1. Verifica o status atual das permissões
    const { status: existingStatus, canAskAgain } =
      await Notifications.getPermissionsAsync();

    console.log("📋 Status atual:", existingStatus);
    console.log("❓ Pode perguntar novamente:", canAskAgain);

    // 2. Se já tem permissão, configura e retorna
    if (existingStatus === "granted") {
      console.log("✅ Permissão já concedida");
      if (Platform.OS === "android") {
        await setupAndroidChannel();
      }
      return true;
    }

    // 3. Se não pode perguntar novamente (usuário negou permanentemente)
    if (!canAskAgain) {
      console.log("❌ Usuário negou permanentemente as notificações");
      return false;
    }

    // 4. ✅ AQUI que deve aparecer o modal do sistema
    console.log("🔔 Solicitando permissões ao usuário...");
    const { status: newStatus } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowDisplayInCarPlay: false,
        allowCriticalAlerts: false,
        provideAppNotificationSettings: false,
        allowProvisional: false,
      },
      android: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    console.log("📋 Nova resposta do usuário:", newStatus);

    if (newStatus === "granted") {
      console.log("✅ Usuário concedeu permissão");
      if (Platform.OS === "android") {
        await setupAndroidChannel();
      }
      return true;
    } else {
      console.log("❌ Usuário negou permissão");
      return false;
    }
  } catch (error) {
    console.error("❌ Erro ao solicitar permissões:", error);
    return false;
  }
};

// ✅ Função para verificar se pode enviar notificações
export const canSendNotifications = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("❌ Erro ao verificar permissões:", error);
    return false;
  }
};

// ✅ Função para mostrar alerta quando permissão é negada
export const showNotificationPermissionAlert = () => {
  Alert.alert(
    "Notificações Desabilitadas",
    "Para receber alertas importantes, você pode habilitar as notificações nas configurações do dispositivo.",
    [
      {
        text: "Agora Não",
        style: "cancel",
      },
      {
        text: "Configurações",
        onPress: () => {
          // Abre as configurações do app
          if (Platform.OS === "ios") {
            Notifications.getPermissionsAsync();
          } else {
            // Para Android, você pode usar Linking
            console.log("Abrir configurações Android");
          }
        },
      },
    ]
  );
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

// ✅ ATUALIZADO: Só agenda se tiver permissão
export const scheduleOverdueNotification = async (
  alertId: string,
  alertTitle: string,
  scheduledAt: string
): Promise<string | null> => {
  try {
    // ✅ Verifica permissão antes de agendar
    const hasPermission = await canSendNotifications();
    if (!hasPermission) {
      console.log("⚠️ Sem permissão para notificações - não agendando");
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

// ✅ ATUALIZADO: Só agenda se tiver permissão
export const scheduleReminderNotification = async (
  alertId: string,
  alertTitle: string,
  scheduledAt: string,
  minutesBefore: number = 15
): Promise<string | null> => {
  try {
    const hasPermission = await canSendNotifications();
    if (!hasPermission) {
      console.log(
        "⚠️ Sem permissão para notificações - não agendando lembrete"
      );
      return null;
    }

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
    const hasPermission = await canSendNotifications();
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
      trigger: null,
    });

    return true;
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
};
