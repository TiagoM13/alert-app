import React from "react";
import {
  FooterText,
  NotificationContainer,
  NotificationDescription,
  NotificationFooter,
  NotificationHeader,
  NotificationTitle,
  NotificationType,
} from "./notification.styles";

import { Theme } from "@/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { TouchableOpacity } from "react-native";

export const NotificationItem: React.FC = () => {
  return (
    <NotificationContainer>
      <NotificationHeader>
        <NotificationType>Emergency</NotificationType>
        <TouchableOpacity activeOpacity={0.7}>
          <SimpleLineIcons
            name="arrow-right"
            size={16}
            color={Theme.colors.textLabel}
          />
        </TouchableOpacity>
      </NotificationHeader>
      <NotificationTitle>Flash Flood Warning</NotificationTitle>
      <NotificationDescription>
        Immediate evacuation required in downtown area...
      </NotificationDescription>
      <NotificationFooter>
        <MaterialIcons
          name="location-on"
          size={16}
          color={Theme.colors.textLabel}
        />
        <FooterText>Downtown District</FooterText>
        <SimpleLineIcons
          name="clock"
          size={12}
          color={Theme.colors.textLabel}
        />
        <FooterText>2 min ago</FooterText>
      </NotificationFooter>
    </NotificationContainer>
  );
};
