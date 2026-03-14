import { enrollments as seedEnrollments, seedVersion } from "../../../data/mockData";
import type { Enrollment } from "../../../types";
import { loadFromStorage, saveToStorage } from "../../../utils/storage";

const ENROLLMENTS_KEY = "nhu-enrollments";
const VERSION_KEY = "nhu-seed-version";

const ensureVersion = () => {
  const current = loadFromStorage(VERSION_KEY, "");
  if (current !== seedVersion) {
    saveToStorage(ENROLLMENTS_KEY, seedEnrollments);
    saveToStorage(VERSION_KEY, seedVersion);
  }
};

export const studentService = {
  getEnrollments: (): Enrollment[] => {
    ensureVersion();
    return loadFromStorage(ENROLLMENTS_KEY, seedEnrollments);
  },
  saveEnrollments: (items: Enrollment[]) => saveToStorage(ENROLLMENTS_KEY, items),
};
