import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentCourses from "../pages/student/StudentCourses";
import StudentTimetable from "../pages/student/StudentTimetable";
import RequestStatusPage from "../pages/shared/RequestStatus";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TakeAttendancePage from "../pages/teacher/TakeAttendancePage";
import TeacherClasses from "../pages/teacher/TeacherClasses";
import TeacherSchedule from "../pages/teacher/TeacherSchedule";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminStructure from "../pages/admin/AdminStructure";
import AdminAttendanceReports from "../pages/admin/AdminAttendanceReports";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminRequests from "../pages/admin/AdminRequests";

const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/timetable"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentTimetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/requests"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <RequestStatusPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance/take"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TakeAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/schedule"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/requests"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <RequestStatusPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/structure"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminStructure />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports/attendance"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAttendanceReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
