export type AlertType = "Emergency" | "Warning" | "Information";

export interface Alert {
  id: string;
  title: string;
  message: string;
  location?: string;
  type: AlertType;
  createdAt: string;
  updatedAt: string;
  priority: "Low" | "Medium" | "High";
  scheduledAt?: string;
}
