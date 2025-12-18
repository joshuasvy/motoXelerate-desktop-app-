import { createContext } from "react";
import { useNotifications } from "../hooks/useNotification";

export type NotificationContextValue = ReturnType<typeof useNotifications>;

// ✅ Only export the context here
export const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined);
