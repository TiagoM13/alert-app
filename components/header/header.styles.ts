import { Theme } from "@/constants";
// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components/native";

export const HeaderView = styled.View`
  color: ${Theme.colors.cardBackground};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid ${Theme.colors.cardBackground};
`;

export const HeaderTitle = styled.Text`
  font-size: ${Theme.font.headerTitle}px;
  font-weight: 600;
  color: ${Theme.colors.textPrimary};
`;

export const IconView = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${Theme.colors.cardBackground};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
