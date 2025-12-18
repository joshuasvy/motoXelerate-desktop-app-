import type { ReactNode } from "react";
import { useNotifications } from "../hooks/useNotification";
import { NotificationContext } from "./NotificationContext";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const notifHook = useNotifications();
  return (
    <NotificationContext.Provider value={notifHook}>
      {children}
    </NotificationContext.Provider>
  );
};
