import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { TouchableOpacity } from "react-native";

import { Theme } from "@/constants";
import {
  FooterText,
  NotificationContainer,
  NotificationDescription,
  NotificationFooter,
  NotificationHeader,
  NotificationTitle,
  NotificationType,
} from "./alert.styles";
import { Alert } from "./types";

interface NotificationItemProps {
  alert: Alert;
}

const getColorByType = (type: Alert["type"]) => {
  switch (type) {
    case "Emergency":
      return Theme.colors.alert;
    case "Warning":
      return Theme.colors.warning;
    case "Information":
      return Theme.colors.success;
    default:
      return Theme.colors.textLabel;
  }
};

export const AlertItem: React.FC<NotificationItemProps> = ({ alert }) => {
  const timeAgo = formatDistanceToNow(new Date(alert.createdAt), {
    addSuffix: true,
  });
  const color = getColorByType(alert.type);

  return (
    <NotificationContainer borderColor={color} textColor={color}>
      <NotificationHeader>
        <NotificationType textColor={color}>{alert.type}</NotificationType>
        <TouchableOpacity activeOpacity={0.7}>
          <SimpleLineIcons
            name="arrow-right"
            size={16}
            color={Theme.colors.textLabel}
          />
        </TouchableOpacity>
      </NotificationHeader>

      <NotificationTitle>{alert.title}</NotificationTitle>
      <NotificationDescription>{alert.message}</NotificationDescription>

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
        <FooterText>{timeAgo}</FooterText>
      </NotificationFooter>
    </NotificationContainer>
  );
};
