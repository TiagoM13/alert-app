import { fetchAlerts, updateAlertStatus } from "@/database/database";
import { format, parseISO } from "date-fns";

// Função para verificar e atualizar alertas vencidos
export const checkAndUpdateOverdueAlerts = async (userId: string) => {
  try {
    console.log("🔄 Verificando alertas vencidos...");

    // Busca todos os alertas do usuário
    const alerts = await fetchAlerts(userId);

    // Filtra alertas que podem estar vencidos
    const potentialOverdueAlerts = alerts.filter((alert) => {
      return alert.scheduledAt && alert.status === "pending";
    });

    console.log(
      `⏰ ${potentialOverdueAlerts.length} alertas pendentes com horário agendado`
    );

    // Verifica quais estão realmente vencidos
    const overdueAlerts = potentialOverdueAlerts.filter((alert) => {
      // Trata o scheduledAt como horário local (mesmo que nas notificações)
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
        `🔄 Atualizando ${overdueAlerts.length} alertas para 'overdue'`
      );

      await Promise.all(
        overdueAlerts.map((alert) => updateAlertStatus(alert.id, "overdue"))
      );

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
