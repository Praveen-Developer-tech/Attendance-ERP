import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { NotificationItem, Role } from "../../types";
import { notificationService } from "./services/notificationService";

interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: notificationService.getNotifications(),
};

interface AddNotificationPayload extends Omit<NotificationItem, "id" | "createdAt" | "read"> {
  id?: string;
  createdAt?: string;
  read?: boolean;
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AddNotificationPayload>) => {
      const now = new Date().toISOString();
      const item: NotificationItem = {
        id: action.payload.id ?? nanoid(),
        title: action.payload.title,
        description: action.payload.description,
        recipientUserId: action.payload.recipientUserId,
        recipientRole: action.payload.recipientRole,
        link: action.payload.link,
        createdAt: action.payload.createdAt ?? now,
        read: action.payload.read ?? false,
      };
      state.items.unshift(item);
      notificationService.saveNotifications(state.items);
    },
    markRead: (state, action: PayloadAction<string>) => {
      state.items = state.items.map((item) => (item.id === action.payload ? { ...item, read: true } : item));
      notificationService.saveNotifications(state.items);
    },
    markAllReadForUser: (state, action: PayloadAction<{ userId?: string; role?: Role }>) => {
      const { userId, role } = action.payload;
      state.items = state.items.map((item) => {
        const match = (userId && item.recipientUserId === userId) || (role && item.recipientRole === role);
        return match ? { ...item, read: true } : item;
      });
      notificationService.saveNotifications(state.items);
    },
  },
});

export const { addNotification, markRead, markAllReadForUser } = notificationsSlice.actions;
export default notificationsSlice.reducer;
