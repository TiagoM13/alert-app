import { Alert } from "@/components/alerts/types";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

// Função para abrir o banco de dados
const getDb = async () => {
  if (db === null) {
    db = await SQLite.openDatabaseAsync("alerts.db");
  }
  return db;
};

// Função para inicializar as tabelas
export const initDatabase = async () => {
  try {
    const database = await getDb();
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        location TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );`
    );
    console.log("Tabela 'alerts' criada com sucesso ou já existente.");
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
    throw error;
  }
};

// Função para inserir um novo alerta
export const insertAlert = async (alert: Alert) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(
      `INSERT INTO alerts (id, title, message, type, location, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        alert.id,
        alert.title,
        alert.message,
        alert.type,
        alert.location || "",
        alert.createdAt,
        alert.updatedAt,
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

// Função para buscar todos os alertas
export const fetchAlerts = async (): Promise<Alert[]> => {
  try {
    const database = await getDb();
    const allRows = await database.getAllAsync<Alert>(
      `SELECT * FROM alerts ORDER BY createdAt DESC;`
    );
    console.log("Alertas buscados com sucesso.");
    return allRows;
  } catch (error) {
    console.error("Erro ao buscar alertas:", error);
    throw error;
  }
};

// Função para buscar um alerta por ID
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

// Função para deletar um alerta por ID
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

// Função para atualizar um alerta existente
export const updateAlert = async (alert: Alert) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(
      `UPDATE alerts SET title = ?, message = ?, type = ?, updatedAt = ?, location = ? WHERE id = ?;`,
      [
        alert.title,
        alert.message,
        alert.type,
        alert.updatedAt,
        alert.location || "",
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
