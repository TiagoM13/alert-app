import { Theme } from "@/constants";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.cardBackground,
  },
  headerTitle: {
    fontSize: Theme.font.headerTitle,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  userAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
