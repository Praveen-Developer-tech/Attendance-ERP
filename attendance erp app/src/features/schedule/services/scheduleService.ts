import { classSessions as seedSessions, seedVersion } from "../../../data/mockData";
import type { ClassSession } from "../../../types";
import { loadFromStorage, saveToStorage } from "../../../utils/storage";

const SESSIONS_KEY = "nhu-sessions";
const VERSION_KEY = "nhu-seed-version";

const ensureVersion = () => {
  const current = loadFromStorage(VERSION_KEY, "");
  if (current !== seedVersion) {
    saveToStorage(SESSIONS_KEY, seedSessions);
    saveToStorage(VERSION_KEY, seedVersion);
  }
};

export const scheduleService = {
  getSessions: (): ClassSession[] => {
    ensureVersion();
    return loadFromStorage(SESSIONS_KEY, seedSessions);
  },
  saveSessions: (sessions: ClassSession[]) => saveToStorage(SESSIONS_KEY, sessions),
};
