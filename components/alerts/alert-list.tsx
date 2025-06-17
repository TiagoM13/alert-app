import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AlertItem } from "./alert-item";
import { Alert } from "./types";

// Dados de exemplo para as notificações
export const alerts: Alert[] = [
  {
    id: "1",
    title: "Pedido Enviado",
    message: "Seu pedido foi enviado!",
    type: "Information",
    createdAt: "2025-06-17T08:30:00Z",
    updatedAt: "2025-06-17T08:30:00Z",
  },
  {
    id: "2",
    title: "Nova Mensagem",
    message: "Nova mensagem de João Silva",
    type: "Information",
    createdAt: "2025-06-17T09:15:00Z",
    updatedAt: "2025-06-17T09:15:00Z",
  },
  {
    id: "3",
    title: "Lembrete",
    message: "Lembrete: Reunião às 15h",
    type: "Warning",
    createdAt: "2025-06-17T07:00:00Z",
    updatedAt: "2025-06-17T07:00:00Z",
  },
  {
    id: "4",
    title: "Alerta de Inundação",
    message: "Alerta de inundação repentina na sua região!",
    type: "Emergency",
    createdAt: "2025-06-17T06:40:00Z",
    updatedAt: "2025-06-17T06:40:00Z",
  },
  {
    id: "5",
    title: "Atualização do Produto",
    message: "Atualização do produto: Versão 2.0 lançada",
    type: "Information",
    createdAt: "2025-06-15T12:00:00Z",
    updatedAt: "2025-06-15T12:00:00Z",
  },
  {
    id: "6",
    title: "Pagamento Aprovado",
    message: "Seu pagamento foi aprovado",
    type: "Information",
    createdAt: "2025-06-17T10:05:00Z",
    updatedAt: "2025-06-17T10:05:00Z",
  },
  {
    id: "7",
    title: "Oferta Especial",
    message: "Oferta por tempo limitado só para você!",
    type: "Warning",
    createdAt: "2025-06-16T18:20:00Z",
    updatedAt: "2025-06-16T18:20:00Z",
  },
  {
    id: "8",
    title: "Evacuação Imediata",
    message: "Dirija-se imediatamente ao ponto de evacuação mais próximo.",
    type: "Emergency",
    createdAt: "2025-06-17T05:30:00Z",
    updatedAt: "2025-06-17T05:30:00Z",
  },
];

export function AlertList() {
  const renderNotificationItem = ({ item }: { item: Alert }) => (
    <AlertItem alert={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 16,
    paddingVertical: 10,
    paddingBottom: 80,
  },
});
