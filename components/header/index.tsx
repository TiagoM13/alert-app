import { Theme } from "@/constants";
import React from "react";
import { TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  HeaderTitle,
  HeaderView,
  IconView,
  UserAvatarButton,
} from "./header.styles";

interface HeaderComponentProps {
  title?: string;
  onBellPress?: () => void;
  onUserAvatarPress?: () => void;
}

export const Header: React.FC<HeaderComponentProps> = ({
  title = "",
  onBellPress,
  onUserAvatarPress,
}) => {
  return (
    <HeaderView>
      <HeaderTitle>{title}</HeaderTitle>

      <IconView>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBellPress}
          style={{ padding: 5 }}
        >
          <Ionicons
            name="notifications-outline"
            size={Theme.font.iconSize}
            color={Theme.colors.iconColor}
          />
        </TouchableOpacity>

        <UserAvatarButton activeOpacity={0.7} onPress={onUserAvatarPress}>
          <FontAwesome
            name="user"
            size={Theme.font.userIconSize}
            color={Theme.colors.iconColor}
          />
        </UserAvatarButton>
      </IconView>
    </HeaderView>
  );
};
