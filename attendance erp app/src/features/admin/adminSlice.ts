import { createSlice } from "@reduxjs/toolkit";
import { adminService } from "./services/adminService";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Batch, Course, Department, User } from "../../types";

export interface AdminState {
  users: User[];
  courses: Course[];
  departments: Department[];
  batches: Batch[];
}

const initialState: AdminState = {
  users: adminService.getUsers(),
  courses: adminService.getCourses(),
  departments: adminService.getDepartments(),
  batches: adminService.getBatches(),
};

const persist = (state: AdminState) => {
  adminService.saveUsers(state.users);
  adminService.saveCourses(state.courses);
  adminService.saveDepartments(state.departments);
  adminService.saveBatches(state.batches);
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      adminService.saveUsers(state.users);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.users = state.users.map((user) => (user.id === action.payload.id ? action.payload : user));
      adminService.saveUsers(state.users);
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      adminService.saveUsers(state.users);
    },
    toggleUserStatus: (state, action: PayloadAction<{ id: string; status: "active" | "inactive" }>) => {
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? { ...user, status: action.payload.status } : user,
      );
      adminService.saveUsers(state.users);
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
      adminService.saveCourses(state.courses);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      state.courses = state.courses.map((course) => (course.id === action.payload.id ? action.payload : course));
      adminService.saveCourses(state.courses);
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((course) => course.id !== action.payload);
      adminService.saveCourses(state.courses);
    },
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload);
      adminService.saveDepartments(state.departments);
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      state.departments = state.departments.map((dept) => (dept.id === action.payload.id ? action.payload : dept));
      adminService.saveDepartments(state.departments);
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((dept) => dept.id !== action.payload);
      adminService.saveDepartments(state.departments);
    },
    addBatch: (state, action: PayloadAction<Batch>) => {
      state.batches.push(action.payload);
      adminService.saveBatches(state.batches);
    },
    updateBatch: (state, action: PayloadAction<Batch>) => {
      state.batches = state.batches.map((batch) => (batch.id === action.payload.id ? action.payload : batch));
      adminService.saveBatches(state.batches);
    },
    deleteBatch: (state, action: PayloadAction<string>) => {
      state.batches = state.batches.filter((batch) => batch.id !== action.payload);
      adminService.saveBatches(state.batches);
    },
    hydrateAdminData: (state) => {
      state.users = adminService.getUsers();
      state.courses = adminService.getCourses();
      state.departments = adminService.getDepartments();
      state.batches = adminService.getBatches();
      persist(state);
    },
  },
});

export const {
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  addCourse,
  updateCourse,
  deleteCourse,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addBatch,
  updateBatch,
  deleteBatch,
  hydrateAdminData,
} = adminSlice.actions;

export default adminSlice.reducer;
