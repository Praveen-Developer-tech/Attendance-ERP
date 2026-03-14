import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/adminSlice";
import studentsReducer from "../features/students/studentsSlice";
import teachersReducer from "../features/teachers/teachersSlice";
import scheduleReducer from "../features/schedule/scheduleSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";
import requestsReducer from "../features/requests/requestsSlice";
import feedbackReducer from "../features/feedback/feedbackSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    students: studentsReducer,
    teachers: teachersReducer,
    schedule: scheduleReducer,
    attendance: attendanceReducer,
    requests: requestsReducer,
    feedback: feedbackReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
