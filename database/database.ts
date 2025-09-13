import { Alert } from "@/components/alerts/types";
import { cancelScheduledNotification } from "@/services/scheduledNotifications";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

// Função para abrir o banco de dados
const getDb = async () => {
  if (db === null) {
    db = await SQLite.openDatabaseAsync("alerts.db");
  }
  return db;
};

// Função para migrar banco existente (execute uma vez)
export const migrateDatabase = async () => {
  try {
    const database = await getDb();

    // Adiciona as novas colunas se não existirem
    await database.execAsync(`
      ALTER TABLE alerts ADD COLUMN notificationId TEXT;
      ALTER TABLE alerts ADD COLUMN reminderNotificationId TEXT;
    `);

    console.log("✅ Migração do banco concluída");
  } catch (error) {
    // Se as colunas já existem, o erro é esperado
    console.log("⚠️ Colunas já existem ou erro na migração:", error);
  }
};

// ✅ CORRETO: Função para inicializar as tabelas
export const initDatabase = async () => {
  try {
    const database = await getDb();
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY NOT NULL,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        priority TEXT NOT NULL,
        location TEXT,
        scheduledAt TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        notificationId TEXT,
        reminderNotificationId TEXT
      );
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phoneNumber TEXT,
        location TEXT,
        password TEXT NOT NULL
      );`
    );
    console.log("Tabelas criadas/atualizadas com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
    throw error;
  }
};

// ✅ CORRIGIDO: Função para inserir um novo alerta (com campos de notificação)
export const insertAlert = async (alert: Alert) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(
      `INSERT INTO alerts (
        id, userId, title, message, type, priority, location, 
        scheduledAt, status, createdAt, updatedAt, notificationId, reminderNotificationId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        alert.id,
        alert.userId,
        alert.title,
        alert.message,
        alert.type,
        alert.priority,
        alert.location || "",
        alert.scheduledAt || null,
        alert.status,
        alert.createdAt,
        alert.updatedAt,
        alert.notificationId || null, // ✅ NOVO
        alert.reminderNotificationId || null, // ✅ NOVO
      ]
    );
    console.log(
      "Alerta inserido com sucesso:",
      alert.id,
      "Changes:",
      result.changes
    );
  } catch (error) {
    console.error("Erro ao inserir alerta:", error);
    throw error;
  }
};

// ✅ MANTIDO: Função para buscar todos os alertas
export const fetchAlerts = async (userId: string): Promise<Alert[]> => {
  try {
    const database = await getDb();
    const allRows = await database.getAllAsync<Alert>(
      `SELECT * FROM alerts WHERE userId = ? ORDER BY createdAt DESC;`,
      [userId]
    );
    console.log("Alertas buscados com sucesso para o usuário:", userId);
    return allRows;
  } catch (error) {
    console.error("Erro ao buscar alertas:", error);
    throw error;
  }
};

// ✅ MANTIDO: Função para buscar um alerta por ID
export const fetchAlertById = async (
  id: string
): Promise<Alert | undefined> => {
  try {
    const database = await getDb();
    const row = await database.getFirstAsync<Alert>(
      `SELECT * FROM alerts WHERE id = ?;`,
      [id]
    );
    if (row) {
      console.log("Alerta buscado por ID com sucesso:", id);
      return row;
    } else {
      console.log("Alerta não encontrado para o ID:", id);
      return undefined;
    }
  } catch (error) {
    console.error("Erro ao buscar alerta por ID:", error);
    throw error;
  }
};

// ✅ MANTIDO: Função para deletar um alerta por ID (simples)
export const deleteAlert = async (id: string) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(`DELETE FROM alerts WHERE id = ?;`, [
      id,
    ]);
    console.log("Alerta deletado com sucesso:", id, "Changes:", result.changes);
  } catch (error) {
    console.error("Erro ao deletar alerta:", error);
    throw error;
  }
};

// ✅ CORRIGIDO: Função para atualizar um alerta existente (com campos de notificação)
export const updateAlert = async (alert: Alert) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(
      `UPDATE alerts SET 
        title = ?, message = ?, type = ?, priority = ?, 
        scheduledAt = ?, status = ?, updatedAt = ?, location = ?,
        notificationId = ?, reminderNotificationId = ?
      WHERE id = ?;`,
      [
        alert.title,
        alert.message,
        alert.type,
        alert.priority,
        alert.scheduledAt || null,
        alert.status,
        alert.updatedAt,
        alert.location || "",
        alert.notificationId || null, // ✅ NOVO
        alert.reminderNotificationId || null, // ✅ NOVO
        alert.id,
      ]
    );
    console.log(
      "Alerta atualizado com sucesso:",
      alert.id,
      "Changes:",
      result.changes
    );
  } catch (error) {
    console.error("Erro ao atualizar alerta:", error);
    throw error;
  }
};

// ✅ MANTIDO: Função para atualizar o status de um alerta
export const updateAlertStatus = async (id: string, newStatus: string) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(
      `UPDATE alerts SET status = ?, updatedAt = ? WHERE id = ?;`,
      [newStatus, new Date().toISOString(), id]
    );
    console.log(
      `Status do alerta ${id} atualizado para ${newStatus}. Changes:`,
      result.changes
    );
  } catch (error) {
    console.error("Erro ao atualizar o status do alerta:", error);
    throw error;
  }
};

// ✅ MANTIDO: Função para atualizar IDs de notificação
export const updateAlertNotificationIds = async (
  alertId: string,
  notificationId?: string,
  reminderNotificationId?: string
) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(
      `UPDATE alerts SET notificationId = ?, reminderNotificationId = ?, updatedAt = ? WHERE id = ?;`,
      [
        notificationId || null,
        reminderNotificationId || null,
        new Date().toISOString(),
        alertId,
      ]
    );
    console.log(`✅ IDs de notificação atualizados para alerta ${alertId}`);
  } catch (error) {
    console.error("Erro ao atualizar IDs de notificação:", error);
    throw error;
  }
};

// ✅ MANTIDO: Função para deletar alerta e cancelar notificações
export const deleteAlertWithNotifications = async (id: string) => {
  try {
    const database = await getDb();

    // 1. Busca o alerta para obter IDs das notificações
    const alert = await fetchAlertById(id);

    // 2. Cancela notificações agendadas
    if (alert?.notificationId) {
      await cancelScheduledNotification(alert.notificationId);
      console.log("🗑️ Notificação cancelada:", alert.notificationId);
    }
    if (alert?.reminderNotificationId) {
      await cancelScheduledNotification(alert.reminderNotificationId);
      console.log("��️ Lembrete cancelado:", alert.reminderNotificationId);
    }

    // 3. Deleta o alerta
    const result = await database.runAsync(`DELETE FROM alerts WHERE id = ?;`, [
      id,
    ]);
    console.log("✅ Alerta deletado e notificações canceladas:", id);
  } catch (error) {
    console.error("Erro ao deletar alerta:", error);
    throw error;
  }
};

// ✅ MANTIDO: Função para completar alerta e cancelar notificações
export const completeAlertWithNotifications = async (id: string) => {
  try {
    // 1. Busca o alerta para obter IDs das notificações
    const alert = await fetchAlertById(id);

    // 2. Cancela notificações agendadas
    if (alert?.notificationId) {
      await cancelScheduledNotification(alert.notificationId);
      console.log("🗑️ Notificação cancelada:", alert.notificationId);
    }
    if (alert?.reminderNotificationId) {
      await cancelScheduledNotification(alert.reminderNotificationId);
      console.log("🗑️ Lembrete cancelado:", alert.reminderNotificationId);
    }

    // 3. Atualiza status para completed
    await updateAlertStatus(id, "completed");
    console.log("✅ Alerta completado e notificações canceladas:", id);
  } catch (error) {
    console.error("Erro ao completar alerta:", error);
    throw error;
  }
};

// ✅ MANTIDO: Interface User
interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  password?: string;
}

// ✅ MANTIDO: Funções de usuário
export const insertUser = async (user: User) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(
      `INSERT INTO users (id, fullName, email, phoneNumber, location, password) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        user.id,
        user.fullName,
        user.email,
        user.phoneNumber || "",
        user.location || "",
        user.password || "",
      ]
    );
    console.log(
      "Usuário inserido com sucesso",
      user.id,
      "Changes: ",
      result.changes
    );
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);
    throw error;
  }
};

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  try {
    const database = await getDb();
    const row = await database.getFirstAsync<User>(
      `SELECT * FROM users WHERE email = ?;`,
      [email]
    );
    return row as User;
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error);
    throw error;
  }
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  try {
    const database = await getDb();
    const row = await database.getFirstAsync<User>(
      `SELECT * FROM users WHERE id = ?;`,
      [id]
    );
    return row as User;
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    throw error;
  }
};

// ✅ MANTIDO: Função para contar alertas por status
export const countAlertsByStatus = async (userId: string) => {
  try {
    const database = await getDb();

    const result = await database.getAllAsync<{
      status: string;
      count: number;
    }>(
      `SELECT status, COUNT(*) as count FROM alerts WHERE userId = ? GROUP BY status;`,
      [userId]
    );

    const counts = {
      total: 0,
      pending: 0,
      completed: 0,
      overdue: 0,
    };

    result.forEach((row) => {
      counts.total += row.count;

      if (row.status === "pending") {
        counts.pending = row.count;
      } else if (row.status === "completed") {
        counts.completed = row.count;
      } else if (row.status === "overdue") {
        counts.overdue = row.count;
      }
    });

    console.log("Contagem de alertas por status:", counts);
    return counts;
  } catch (error) {
    console.error("Erro ao contar alertas por status:", error);
    throw error;
  }
};
