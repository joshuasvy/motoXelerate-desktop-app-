import type { Notification } from "../hooks/useNotification";

export default function dedupeNotifications(list: Notification[]) {
  const normalized = list.map((n) => ({
    ...n,
    id: n.id ?? (n as any)._id?.toString(),
  }));
  return normalized.filter(
    (n, i, arr) => arr.findIndex((x) => x.id === n.id) === i
  );
}
