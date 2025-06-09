import { Theme } from "@/constants";
import styled from "styled-components/native";

export const NotificationContainer = styled.View`
  padding: 16px;
  border-left-width: 4px;
  border-left-color: ${Theme.colors.alert};
  border-top-left-radius: 16px;
  border-bottom-left-radius: 20px;
  justify-content: center;
  gap: 5px;
`;

export const NotificationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const NotificationType = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${Theme.colors.alert};
`;

export const NotificationTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
`;

export const NotificationDescription = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${Theme.colors.textDescription};
`;

export const NotificationFooter = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

export const FooterText = styled.Text`
  font-size: 12px;
  color: ${Theme.colors.textLabel};
`;
