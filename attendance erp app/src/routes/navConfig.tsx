import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import ChecklistRtlRoundedIcon from "@mui/icons-material/ChecklistRtlRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import type { NavItem, Role } from "../types";

export const navConfig: Record<Role, NavItem[]> = {
  student: [
    { path: "/student/dashboard", label: "Dashboard", icon: <SpaceDashboardRoundedIcon /> },
    { path: "/student/attendance", label: "My Attendance", icon: <ChecklistRtlRoundedIcon /> },
    { path: "/student/courses", label: "My Courses", icon: <MenuBookRoundedIcon /> },
    { path: "/student/timetable", label: "Timetable", icon: <CalendarMonthRoundedIcon /> },
    { path: "/student/requests", label: "Requests", icon: <AssignmentTurnedInRoundedIcon /> },
  ],
  teacher: [
    { path: "/teacher/dashboard", label: "Dashboard", icon: <SpaceDashboardRoundedIcon /> },
    { path: "/teacher/attendance/take", label: "Take Attendance", icon: <ChecklistRtlRoundedIcon /> },
    { path: "/teacher/classes", label: "My Classes", icon: <ClassRoundedIcon /> },
    { path: "/teacher/schedule", label: "Schedule", icon: <CalendarMonthRoundedIcon /> },
    { path: "/teacher/requests", label: "Requests", icon: <AssignmentTurnedInRoundedIcon /> },
  ],
  admin: [
    { path: "/admin/dashboard", label: "Dashboard", icon: <SpaceDashboardRoundedIcon /> },
    { path: "/admin/users", label: "Users", icon: <GroupsRoundedIcon /> },
    { path: "/admin/courses", label: "Courses", icon: <MenuBookRoundedIcon /> },
    { path: "/admin/structure", label: "Departments & Batches", icon: <ApartmentRoundedIcon /> },
    { path: "/admin/reports/attendance", label: "Attendance Reports", icon: <AssessmentRoundedIcon /> },
    { path: "/admin/requests", label: "Requests", icon: <AssessmentRoundedIcon /> },
    { path: "/admin/settings", label: "Settings", icon: <SettingsRoundedIcon /> },
  ],
};

export const defaultRouteByRole: Record<Role, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard",
};
