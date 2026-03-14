import { batches as seedBatches, courses as seedCourses, departments as seedDepartments, users as seedUsers, seedVersion } from "../../../data/mockData";
import type { Batch, Course, Department, User } from "../../../types";
import { loadFromStorage, saveToStorage } from "../../../utils/storage";

const USERS_KEY = "nhu-users";
const COURSES_KEY = "nhu-courses";
const DEPARTMENTS_KEY = "nhu-departments";
const BATCHES_KEY = "nhu-batches";
const VERSION_KEY = "nhu-seed-version";

const ensureVersion = () => {
  const current = loadFromStorage(VERSION_KEY, "");
  if (current !== seedVersion) {
    saveToStorage(USERS_KEY, seedUsers);
    saveToStorage(COURSES_KEY, seedCourses);
    saveToStorage(DEPARTMENTS_KEY, seedDepartments);
    saveToStorage(BATCHES_KEY, seedBatches);
    saveToStorage(VERSION_KEY, seedVersion);
  }
};

export const adminService = {
  getUsers: (): User[] => {
    ensureVersion();
    return loadFromStorage(USERS_KEY, seedUsers);
  },
  saveUsers: (users: User[]) => saveToStorage(USERS_KEY, users),
  getCourses: (): Course[] => {
    ensureVersion();
    return loadFromStorage(COURSES_KEY, seedCourses);
  },
  saveCourses: (courses: Course[]) => saveToStorage(COURSES_KEY, courses),
  getDepartments: (): Department[] => {
    ensureVersion();
    return loadFromStorage(DEPARTMENTS_KEY, seedDepartments);
  },
  saveDepartments: (items: Department[]) => saveToStorage(DEPARTMENTS_KEY, items),
  getBatches: (): Batch[] => {
    ensureVersion();
    return loadFromStorage(BATCHES_KEY, seedBatches);
  },
  saveBatches: (items: Batch[]) => saveToStorage(BATCHES_KEY, items),
};
