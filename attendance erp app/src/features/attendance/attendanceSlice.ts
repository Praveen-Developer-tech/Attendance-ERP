import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AttendanceRecord } from "../../types";
import { attendanceService } from "./services/attendanceService";

interface AttendanceState {
  records: AttendanceRecord[];
}

const initialState: AttendanceState = {
  records: attendanceService.getRecords(),
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    markAttendance: (state, action: PayloadAction<Omit<AttendanceRecord, "id">[]>) => {
      const newRecords = action.payload.map((record) => ({ ...record, id: nanoid() }));
      state.records = state.records.filter(
        (record) => !newRecords.some((newRecord) => newRecord.sessionId === record.sessionId && newRecord.studentId === record.studentId),
      );
      state.records.push(...newRecords);
      attendanceService.saveRecords(state.records);
    },
    updateAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      state.records = state.records.map((record) => (record.id === action.payload.id ? action.payload : record));
      attendanceService.saveRecords(state.records);
    },
  },
});

export const { markAttendance, updateAttendanceRecord } = attendanceSlice.actions;
export default attendanceSlice.reducer;
