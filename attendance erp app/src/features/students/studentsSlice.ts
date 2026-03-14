import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Enrollment } from "../../types";
import { studentService } from "./services/studentService";

interface StudentState {
  enrollments: Enrollment[];
  selectedCourseId?: string;
}

const initialState: StudentState = {
  enrollments: studentService.getEnrollments(),
  selectedCourseId: undefined,
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setSelectedCourse: (state, action: PayloadAction<string | undefined>) => {
      state.selectedCourseId = action.payload;
    },
    enrollCourse: (state, action: PayloadAction<Enrollment>) => {
      const exists = state.enrollments.some((item) => item.courseId === action.payload.courseId && item.studentId === action.payload.studentId);
      if (!exists) {
        state.enrollments.push(action.payload);
        studentService.saveEnrollments(state.enrollments);
      }
    },
    dropCourse: (state, action: PayloadAction<{ enrollmentId: string }>) => {
      state.enrollments = state.enrollments.filter((enrollment) => enrollment.id !== action.payload.enrollmentId);
      studentService.saveEnrollments(state.enrollments);
    },
    hydrateEnrollments: (state) => {
      state.enrollments = studentService.getEnrollments();
    },
  },
});

export const { setSelectedCourse, enrollCourse, dropCourse, hydrateEnrollments } = studentSlice.actions;
export default studentSlice.reducer;
