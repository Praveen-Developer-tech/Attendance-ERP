import { attendanceRecords as seedRecords, seedVersion } from "../../../data/mockData";
import type { AttendanceRecord } from "../../../types";
import { loadFromStorage, saveToStorage } from "../../../utils/storage";

const ATTENDANCE_KEY = "nhu-attendance-records";
const VERSION_KEY = "nhu-seed-version";

const ensureVersion = () => {
  const current = loadFromStorage(VERSION_KEY, "");
  if (current !== seedVersion) {
    saveToStorage(ATTENDANCE_KEY, seedRecords);
    saveToStorage(VERSION_KEY, seedVersion);
  }
};

export const attendanceService = {
  getRecords: (): AttendanceRecord[] => {
    ensureVersion();
    return loadFromStorage(ATTENDANCE_KEY, seedRecords);
  },
  saveRecords: (records: AttendanceRecord[]) => saveToStorage(ATTENDANCE_KEY, records),
};
