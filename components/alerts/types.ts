export type AlertType = "Emergency" | "Warning" | "Information";

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  createdAt: string;
  updatedAt: string;
}
