import { Theme } from "@/constants";
// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components/native";

export const HeaderView = styled.View`
  color: ${Theme.colors.cardBackground};
  flex-direction: "row";
  justify-content: "space-between";
  align-items: "center";
  padding: 15 20;
  border: 1px solid ${Theme.colors.cardBackground};
`;

export const HeaderTitle = styled.Text`
  font-size: ${Theme.font.headerTitle};
  font-weight: "bold";
  color: ${Theme.colors.textPrimary};
`;

export const IconView = styled.View`
  flex-direction: "row";
  align-items: "center";
  gap: 15;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  width: 40;
  height: 40;
  border-radius: 20;
  background-color: ${Theme.colors.cardBackground};
  justify-content: "center";
  align-items: "center";
  overflow: "hidden";
`;
