export type AlertType = "Emergency" | "Warning" | "Information";
export type AlertStatus = "pending" | "completed" | "overdue";
export type AlertPriority = "Low" | "Medium" | "High";

export interface Alert {
  id: string;
  userId: string; // Adicione esta linha
  title: string;
  message: string;
  type: AlertType;
  location?: string;
  priority: AlertPriority; // Adicione esta linha
  scheduledAt?: string; // Adicione esta linha
  status: AlertStatus; // Adicione esta linha
  createdAt: string;
  updatedAt: string;
  notificationId?: string;
  reminderNotificationId?: string;
}
