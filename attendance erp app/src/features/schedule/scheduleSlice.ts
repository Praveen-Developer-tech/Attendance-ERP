import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ClassSession } from "../../types";
import { scheduleService } from "./services/scheduleService";

interface ScheduleState {
  sessions: ClassSession[];
}

const initialState: ScheduleState = {
  sessions: scheduleService.getSessions(),
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    addSession: {
      reducer: (state, action: PayloadAction<ClassSession>) => {
        state.sessions.push(action.payload);
        scheduleService.saveSessions(state.sessions);
      },
      prepare: (session: Omit<ClassSession, "id">) => ({
        payload: { ...session, id: nanoid() },
      }),
    },
    updateSession: (state, action: PayloadAction<ClassSession>) => {
      state.sessions = state.sessions.map((session) => (session.id === action.payload.id ? action.payload : session));
      scheduleService.saveSessions(state.sessions);
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter((session) => session.id !== action.payload);
      scheduleService.saveSessions(state.sessions);
    },
  },
});

export const { addSession, updateSession, deleteSession } = scheduleSlice.actions;
export default scheduleSlice.reducer;
