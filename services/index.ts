import { fetchAlerts, updateAlertStatus } from "@/database/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO } from "date-fns";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { sendOverdueNotification } from "./notifications";

// Nome da tarefa - deve ser único
const BACKGROUND_SYNC_TASK = "background-alert-sync";

// Função que verifica e atualiza alertas vencidos
export const checkAndUpdateOverdueAlerts = async (userId?: string) => {
  try {
    console.log("🔄 Iniciando verificação de alertas vencidos...");

    if (!userId) {
      console.log("❌ UserId não fornecido para verificação");
      return { success: false, message: "UserId não fornecido" };
    }

    // Busca todos os alertas do usuário
    const alerts = await fetchAlerts(userId);
    console.log(`📊 Encontrados ${alerts.length} alertas para verificar`);

    // Filtra alertas que podem estar vencidos
    const potentialOverdueAlerts = alerts.filter((alert) => {
      return alert.scheduledAt && alert.status === "pending";
    });

    console.log(
      `⏰ ${potentialOverdueAlerts.length} alertas pendentes com horário agendado`
    );

    // Verifica quais estão realmente vencidos
    const overdueAlerts = potentialOverdueAlerts.filter((alert) => {
      // Trata o scheduledAt como horário local (mesmo que no hook)
      const scheduledAtWithoutZ = alert.scheduledAt!.replace("Z", "");
      const scheduledAtLocal = parseISO(scheduledAtWithoutZ);
      const scheduledAtLocalISO = format(
        scheduledAtLocal,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );

      // Hora atual local
      const nowLocal = new Date();
      const nowLocalISO = format(nowLocal, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

      const isOverdue = nowLocalISO > scheduledAtLocalISO;

      if (isOverdue) {
        console.log(
          `⚠️ Alerta vencido encontrado: ${alert.title} (${alert.id})`
        );
      }

      return isOverdue;
    });

    // Atualiza os alertas vencidos
    if (overdueAlerts.length > 0) {
      console.log(
        `�� Atualizando ${overdueAlerts.length} alertas para 'overdue'`
      );

      await Promise.all(
        overdueAlerts.map((alert) => updateAlertStatus(alert.id, "overdue"))
      );

      // NOVO: Enviar notificação
      await sendOverdueNotification(overdueAlerts.length);

      console.log("✅ Alertas atualizados com sucesso!");
      return {
        success: true,
        message: `${overdueAlerts.length} alertas atualizados para vencidos`,
        updatedCount: overdueAlerts.length,
      };
    } else {
      console.log("✅ Nenhum alerta vencido encontrado");
      return {
        success: true,
        message: "Nenhum alerta vencido encontrado",
        updatedCount: 0,
      };
    }
  } catch (error) {
    console.error("❌ Erro na verificação de alertas vencidos:", error);
    return {
      success: false,
      message: `Erro: ${error}`,
      updatedCount: 0,
    };
  }
};

// Definir a tarefa em background
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log("🚀 Tarefa de background iniciada");

    // Aqui você precisa obter o userId do usuário logado
    // Vamos criar uma função para isso
    const userId = await getCurrentUserId();

    if (!userId) {
      console.log("❌ Nenhum usuário logado para sincronização");
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    const result = await checkAndUpdateOverdueAlerts(userId);

    if (result.success) {
      console.log("✅ Sincronização em background concluída com sucesso");
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      console.log("⚠️ Sincronização em background falhou");
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  } catch (error) {
    console.error("❌ Erro na tarefa de background:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const userId = await AsyncStorage.getItem("currentUserId");
    if (userId) {
      console.log(`👤 UserId encontrado para sync: ${userId}`);
      return userId;
    }
    console.log("❌ Nenhum userId encontrado no storage");
    return null;
  } catch (error) {
    console.error("Erro ao obter userId atual:", error);
    return null;
  }
};

// Função para registrar a tarefa de background
export const registerBackgroundSync = async () => {
  try {
    console.log("📝 Registrando tarefa de background...");

    // Verifica se já está registrada
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);

    if (isRegistered) {
      console.log("✅ Tarefa já estava registrada");
      return;
    }

    // Registra a tarefa com configurações otimizadas
    await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15 * 60 * 1000, // 15 minutos (mínimo)
      stopOnTerminate: false,
      startOnBoot: true,
    });

    // NOVO: Configura para execução mais frequente (iOS)
    if (Platform.OS === "ios") {
      await BackgroundFetch.setMinimumIntervalAsync(15 * 60 * 1000);
    }

    console.log("✅ Tarefa de background registrada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao registrar tarefa de background:", error);
  }
};

// Função para cancelar a tarefa de background
export const unregisterBackgroundSync = async () => {
  try {
    console.log("🗑️ Cancelando tarefa de background...");

    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);

    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
      console.log("✅ Tarefa de background cancelada");
    } else {
      console.log("⚠️ Tarefa não estava registrada");
    }
  } catch (error) {
    console.error("❌ Erro ao cancelar tarefa de background:", error);
  }
};

// Função para verificar status da tarefa
export const getBackgroundSyncStatus = async () => {
  try {
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    const status = await BackgroundFetch.getStatusAsync();

    return {
      isRegistered,
      status,
      statusText: getStatusText(status!),
    };
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    return {
      isRegistered: false,
      status: BackgroundFetch.BackgroundFetchStatus.Denied,
      statusText: "Erro",
    };
  }
};

// Função auxiliar para converter status em texto
const getStatusText = (
  status: BackgroundFetch.BackgroundFetchStatus
): string => {
  switch (status) {
    case BackgroundFetch.BackgroundFetchStatus.Available:
      return "Disponível";
    case BackgroundFetch.BackgroundFetchStatus.Denied:
      return "Negado";
    case BackgroundFetch.BackgroundFetchStatus.Restricted:
      return "Restrito";
    default:
      return "Desconhecido";
  }
};
