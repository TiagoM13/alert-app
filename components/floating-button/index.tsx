import { Theme } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { styled } from "styled-components/native";

export const FloatingButton: React.FC<
  React.ComponentPropsWithoutRef<typeof TouchableOpacity>
> = ({ ...props }) => {
  return (
    <FloatingButtonContainer {...props} activeOpacity={0.7}>
      <Ionicons name="add" size={28} color={Theme.colors.white} />
    </FloatingButtonContainer>
  );
};

export const FloatingButtonContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${Theme.colors.primary};
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
  shadow-offset: 0px 3px;
`;
