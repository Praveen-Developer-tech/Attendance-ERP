import { loadFromStorage, saveToStorage } from "../../../utils/storage";

const TEACHER_PENDING_KEY = "nhu-teacher-pending";

export const teacherService = {
  getPendingSessions: (): string[] => loadFromStorage(TEACHER_PENDING_KEY, [] as string[]),
  savePendingSessions: (sessionIds: string[]) => saveToStorage(TEACHER_PENDING_KEY, sessionIds),
};
