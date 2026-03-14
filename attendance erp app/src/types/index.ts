import type { ReactNode } from "react";

export type Role = "student" | "teacher" | "admin";

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Batch {
  id: string;
  name: string;
  year: number;
  departmentId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  departmentId?: string;
  batchId?: string;
  status: "active" | "inactive";
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  departmentId: string;
  semester: number;
  type: "core" | "optional";
  teacherId: string;
  scheduleSummary?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  isCore: boolean;
}

export interface ClassSession {
  id: string;
  courseId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  type: "regular" | "extra" | "optional" | "event";
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export type RequestType = "attendance-update" | "session-edit" | "course-drop" | "student-registration" | "teacher-registration";

export type RequestStatus = "pending" | "approved" | "declined";

export interface RequestItem {
  id: string;
  type: RequestType;
  title: string;
  description?: string;
  createdBy: string; // user id
  createdForRole: Role; // who needs to approve (admin or teacher)
  approvers: Role[]; // roles that must approve
  approvals: Partial<Record<Role, RequestStatus>>;
  payload: Record<string, unknown>;
  remarks?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  recipientUserId?: string;
  recipientRole?: Role;
  link?: string;
  createdAt: string;
  read: boolean;
}

export interface TimetableSlot {
  day: string;
  startTime: string;
  endTime: string;
  courseId: string;
  room: string;
}

export interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

export interface DashboardSummary {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "flat";
}
