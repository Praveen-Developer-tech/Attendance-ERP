import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { teacherService } from "./services/teacherService";

interface TeacherState {
  pendingSessionIds: string[];
  activeSessionId?: string;
}

const initialState: TeacherState = {
  pendingSessionIds: teacherService.getPendingSessions(),
  activeSessionId: undefined,
};

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    setActiveSession: (state, action: PayloadAction<string | undefined>) => {
      state.activeSessionId = action.payload;
    },
    setPendingSessions: (state, action: PayloadAction<string[]>) => {
      state.pendingSessionIds = action.payload;
      teacherService.savePendingSessions(state.pendingSessionIds);
    },
    markSessionComplete: (state, action: PayloadAction<string>) => {
      state.pendingSessionIds = state.pendingSessionIds.filter((id) => id !== action.payload);
      teacherService.savePendingSessions(state.pendingSessionIds);
    },
  },
});

export const { setActiveSession, setPendingSessions, markSessionComplete } = teacherSlice.actions;
export default teacherSlice.reducer;
