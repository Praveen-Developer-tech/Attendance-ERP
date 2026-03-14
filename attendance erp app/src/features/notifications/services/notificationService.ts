import { loadFromStorage, saveToStorage } from "../../../utils/storage";
import type { NotificationItem } from "../../../types";

const NOTIFICATIONS_KEY = "nhu-notifications";

export const notificationService = {
  getNotifications: (): NotificationItem[] => loadFromStorage<NotificationItem[]>(NOTIFICATIONS_KEY, []),
  saveNotifications: (items: NotificationItem[]) => saveToStorage(NOTIFICATIONS_KEY, items),
};
