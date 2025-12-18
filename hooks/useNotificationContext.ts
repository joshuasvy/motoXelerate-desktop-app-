import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import type { NotificationContextValue } from "../context/NotificationContext";

export function useNotificationContext(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return ctx;
}
