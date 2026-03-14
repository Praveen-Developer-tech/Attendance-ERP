import type { AttendanceRecord, Batch, ClassSession, Course, Department, Enrollment, User } from "../types";

export const seedVersion = "seed-v4-2025-12-16b";

export const departments: Department[] = [
  { id: "dept-1", name: "Computer Science", code: "CSE" },
  { id: "dept-2", name: "Business Administration", code: "BUS" },
  { id: "dept-3", name: "Mechanical Engineering", code: "ME" },
  { id: "dept-4", name: "Electronics & Communication", code: "ECE" },
  { id: "dept-5", name: "Design & Media", code: "DES" },
];

export const batches: Batch[] = [
  { id: "batch-1", name: "B.Tech CSE A", year: 2025, departmentId: "dept-1" },
  { id: "batch-2", name: "MBA Core", year: 2024, departmentId: "dept-2" },
  { id: "batch-3", name: "B.Tech ME B", year: 2025, departmentId: "dept-3" },
  { id: "batch-4", name: "B.Tech ECE A", year: 2026, departmentId: "dept-4" },
  { id: "batch-5", name: "B.Des Media", year: 2025, departmentId: "dept-5" },
];

export const users: User[] = [
  { id: "student-1", name: "Avery Patel", email: "student@nhu.edu", role: "student", departmentId: "dept-1", batchId: "batch-1", status: "active" },
  { id: "student-2", name: "Jordan Smith", email: "jordan.smith@nhu.edu", role: "student", departmentId: "dept-1", batchId: "batch-1", status: "active" },
  { id: "student-3", name: "Aarav Singh", email: "aarav.singh@nhu.edu", role: "student", departmentId: "dept-3", batchId: "batch-3", status: "active" },
  { id: "student-4", name: "Priya Nair", email: "priya.nair@nhu.edu", role: "student", departmentId: "dept-4", batchId: "batch-4", status: "active" },
  { id: "student-5", name: "Rohan Gupta", email: "rohan.gupta@nhu.edu", role: "student", departmentId: "dept-5", batchId: "batch-5", status: "active" },
  { id: "student-6", name: "Nidhi Sharma", email: "nidhi.sharma@nhu.edu", role: "student", departmentId: "dept-2", batchId: "batch-2", status: "active" },
  { id: "student-7", name: "Ishan Kumar", email: "ishan.kumar@nhu.edu", role: "student", departmentId: "dept-1", batchId: "batch-1", status: "active" },
  { id: "student-8", name: "Kunal Deshmukh", email: "kunal.deshmukh@nhu.edu", role: "student", departmentId: "dept-1", batchId: "batch-1", status: "active" },
  { id: "student-9", name: "Saanvi Menon", email: "saanvi.menon@nhu.edu", role: "student", departmentId: "dept-2", batchId: "batch-2", status: "active" },
  { id: "student-10", name: "Kabir Malhotra", email: "kabir.malhotra@nhu.edu", role: "student", departmentId: "dept-3", batchId: "batch-3", status: "active" },
  { id: "student-11", name: "Tara Iyer", email: "tara.iyer@nhu.edu", role: "student", departmentId: "dept-4", batchId: "batch-4", status: "active" },
  { id: "student-12", name: "Vikram Patel", email: "vikram.patel@nhu.edu", role: "student", departmentId: "dept-5", batchId: "batch-5", status: "active" },
  { id: "student-13", name: "Meera Dsouza", email: "meera.dsouza@nhu.edu", role: "student", departmentId: "dept-1", batchId: "batch-1", status: "active" },
  { id: "student-14", name: "Ritika Banerjee", email: "ritika.banerjee@nhu.edu", role: "student", departmentId: "dept-2", batchId: "batch-2", status: "active" },
  { id: "student-15", name: "Aditya Roy", email: "aditya.roy@nhu.edu", role: "student", departmentId: "dept-3", batchId: "batch-3", status: "active" },
  { id: "student-16", name: "Devansh Batra", email: "devansh.batra@nhu.edu", role: "student", departmentId: "dept-4", batchId: "batch-4", status: "active" },
  { id: "student-17", name: "Ananya Rao", email: "ananya.rao@nhu.edu", role: "student", departmentId: "dept-5", batchId: "batch-5", status: "active" },
  { id: "student-18", name: "Harshita Jain", email: "harshita.jain@nhu.edu", role: "student", departmentId: "dept-1", batchId: "batch-1", status: "active" },
  { id: "student-19", name: "Omkar Kulkarni", email: "omkar.kulkarni@nhu.edu", role: "student", departmentId: "dept-3", batchId: "batch-3", status: "active" },
  { id: "student-20", name: "Shreya Kapoor", email: "shreya.kapoor@nhu.edu", role: "student", departmentId: "dept-2", batchId: "batch-2", status: "active" },
  { id: "student-21", name: "Lakshya Verma", email: "lakshya.verma@nhu.edu", role: "student", departmentId: "dept-4", batchId: "batch-4", status: "active" },
  { id: "student-22", name: "Pooja Desai", email: "pooja.desai@nhu.edu", role: "student", departmentId: "dept-5", batchId: "batch-5", status: "active" },
  { id: "student-23", name: "Sameer Vaid", email: "sameer.vaid@nhu.edu", role: "student", departmentId: "dept-1", batchId: "batch-1", status: "active" },
  { id: "student-24", name: "Ria Khatri", email: "ria.khatri@nhu.edu", role: "student", departmentId: "dept-2", batchId: "batch-2", status: "active" },
  { id: "student-25", name: "Arnav Pillai", email: "arnav.pillai@nhu.edu", role: "student", departmentId: "dept-3", batchId: "batch-3", status: "active" },
  { id: "teacher-1", name: "Dr. Maya Rao", email: "teacher@nhu.edu", role: "teacher", departmentId: "dept-1", status: "active" },
  { id: "teacher-2", name: "Prof. Arjun Mehta", email: "arjun.mehta@nhu.edu", role: "teacher", departmentId: "dept-1", status: "active" },
  { id: "teacher-3", name: "Dr. Kavya Iyer", email: "kavya.iyer@nhu.edu", role: "teacher", departmentId: "dept-2", status: "active" },
  { id: "teacher-4", name: "Dr. Nidhi Verma", email: "nidhi.verma@nhu.edu", role: "teacher", departmentId: "dept-4", status: "active" },
  { id: "teacher-5", name: "Prof. Sameer Kulkarni", email: "sameer.kulkarni@nhu.edu", role: "teacher", departmentId: "dept-3", status: "active" },
  { id: "admin-1", name: "Sofia Martinez", email: "admin@nhu.edu", role: "admin", status: "active" },
];

export const courses: Course[] = [
  { id: "course-1", code: "CSE101", name: "Data Structures", credits: 4, departmentId: "dept-1", semester: 3, type: "core", teacherId: "teacher-1", scheduleSummary: "Mon & Wed 9:00 - 10:30" },
  { id: "course-2", code: "CSE205", name: "Operating Systems", credits: 3, departmentId: "dept-1", semester: 4, type: "core", teacherId: "teacher-1", scheduleSummary: "Tue & Thu 11:00 - 12:30" },
  { id: "course-3", code: "BUS310", name: "Strategic Management", credits: 3, departmentId: "dept-2", semester: 2, type: "optional", teacherId: "teacher-1", scheduleSummary: "Fri 10:00 - 12:00" },
  { id: "course-4", code: "ME210", name: "Thermodynamics", credits: 4, departmentId: "dept-3", semester: 3, type: "core", teacherId: "teacher-1", scheduleSummary: "Mon & Thu 14:00 - 15:30" },
  { id: "course-5", code: "ECE340", name: "Digital Signal Processing", credits: 3, departmentId: "dept-4", semester: 5, type: "core", teacherId: "teacher-1", scheduleSummary: "Wed & Fri 09:30 - 11:00" },
  { id: "course-6", code: "DES205", name: "Visual Storytelling", credits: 3, departmentId: "dept-5", semester: 2, type: "optional", teacherId: "teacher-1", scheduleSummary: "Tue 13:00 - 15:00" },
  { id: "course-7", code: "CSE320", name: "Machine Learning", credits: 4, departmentId: "dept-1", semester: 6, type: "core", teacherId: "teacher-1", scheduleSummary: "Tue & Thu 15:00 - 16:30" },
];

export const enrollments: Enrollment[] = [
  { id: "enroll-1", studentId: "student-1", courseId: "course-1", isCore: true },
  { id: "enroll-2", studentId: "student-1", courseId: "course-2", isCore: true },
  { id: "enroll-3", studentId: "student-1", courseId: "course-3", isCore: false },
  { id: "enroll-4", studentId: "student-2", courseId: "course-1", isCore: true },
  { id: "enroll-5", studentId: "student-3", courseId: "course-4", isCore: true },
  { id: "enroll-6", studentId: "student-4", courseId: "course-5", isCore: true },
  { id: "enroll-7", studentId: "student-5", courseId: "course-6", isCore: false },
  { id: "enroll-8", studentId: "student-6", courseId: "course-3", isCore: false },
  { id: "enroll-9", studentId: "student-7", courseId: "course-7", isCore: true },
  { id: "enroll-10", studentId: "student-8", courseId: "course-1", isCore: true },
  { id: "enroll-11", studentId: "student-9", courseId: "course-3", isCore: false },
  { id: "enroll-12", studentId: "student-10", courseId: "course-4", isCore: true },
  { id: "enroll-13", studentId: "student-11", courseId: "course-5", isCore: true },
  { id: "enroll-14", studentId: "student-12", courseId: "course-6", isCore: false },
  { id: "enroll-15", studentId: "student-13", courseId: "course-2", isCore: true },
  { id: "enroll-16", studentId: "student-14", courseId: "course-3", isCore: false },
  { id: "enroll-17", studentId: "student-15", courseId: "course-4", isCore: true },
  { id: "enroll-18", studentId: "student-16", courseId: "course-5", isCore: true },
  { id: "enroll-19", studentId: "student-17", courseId: "course-6", isCore: false },
  { id: "enroll-20", studentId: "student-18", courseId: "course-7", isCore: true },
  { id: "enroll-21", studentId: "student-19", courseId: "course-4", isCore: true },
  { id: "enroll-22", studentId: "student-20", courseId: "course-2", isCore: true },
  { id: "enroll-23", studentId: "student-21", courseId: "course-5", isCore: true },
  { id: "enroll-24", studentId: "student-22", courseId: "course-7", isCore: true },
  { id: "enroll-25", studentId: "student-8", courseId: "course-7", isCore: true },
  { id: "enroll-26", studentId: "student-2", courseId: "course-2", isCore: true },
  { id: "enroll-27", studentId: "student-3", courseId: "course-1", isCore: true },
  { id: "enroll-28", studentId: "student-4", courseId: "course-2", isCore: true },
  { id: "enroll-29", studentId: "student-5", courseId: "course-1", isCore: true },
  { id: "enroll-30", studentId: "student-6", courseId: "course-2", isCore: true },
  { id: "enroll-31", studentId: "student-7", courseId: "course-1", isCore: true },
  { id: "enroll-32", studentId: "student-9", courseId: "course-2", isCore: true },
  { id: "enroll-33", studentId: "student-10", courseId: "course-1", isCore: true },
  { id: "enroll-34", studentId: "student-11", courseId: "course-2", isCore: true },
  { id: "enroll-35", studentId: "student-12", courseId: "course-1", isCore: true },
  { id: "enroll-36", studentId: "student-13", courseId: "course-1", isCore: true },
  { id: "enroll-37", studentId: "student-14", courseId: "course-2", isCore: true },
  { id: "enroll-38", studentId: "student-15", courseId: "course-1", isCore: true },
  { id: "enroll-39", studentId: "student-16", courseId: "course-2", isCore: true },
  { id: "enroll-40", studentId: "student-17", courseId: "course-1", isCore: true },
  { id: "enroll-41", studentId: "student-18", courseId: "course-2", isCore: true },
  { id: "enroll-42", studentId: "student-19", courseId: "course-1", isCore: true },
  { id: "enroll-43", studentId: "student-20", courseId: "course-1", isCore: true },
  { id: "enroll-44", studentId: "student-21", courseId: "course-2", isCore: true },
  { id: "enroll-45", studentId: "student-22", courseId: "course-1", isCore: true },
  { id: "enroll-46", studentId: "student-23", courseId: "course-1", isCore: true },
  { id: "enroll-47", studentId: "student-24", courseId: "course-2", isCore: true },
  { id: "enroll-48", studentId: "student-25", courseId: "course-1", isCore: true },
];

export const classSessions: ClassSession[] = [
  { id: "session-1", courseId: "course-1", teacherId: "teacher-1", date: "2025-12-02", startTime: "09:00", endTime: "10:30", room: "NHU-201", type: "regular" },
  { id: "session-2", courseId: "course-2", teacherId: "teacher-1", date: "2025-12-02", startTime: "11:00", endTime: "12:30", room: "NHU-305", type: "regular" },
  { id: "session-3", courseId: "course-3", teacherId: "teacher-1", date: "2025-12-03", startTime: "10:00", endTime: "12:00", room: "NHU-412", type: "optional" },
  { id: "session-4", courseId: "course-4", teacherId: "teacher-1", date: "2025-12-04", startTime: "14:00", endTime: "15:30", room: "ME-210", type: "regular" },
  { id: "session-5", courseId: "course-5", teacherId: "teacher-1", date: "2025-12-05", startTime: "09:30", endTime: "11:00", room: "ECE-108", type: "regular" },
  { id: "session-6", courseId: "course-6", teacherId: "teacher-1", date: "2025-12-06", startTime: "13:00", endTime: "15:00", room: "DES-102", type: "optional" },
  { id: "session-7", courseId: "course-7", teacherId: "teacher-1", date: "2025-12-07", startTime: "15:00", endTime: "16:30", room: "CSE-404", type: "regular" },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "att-1", sessionId: "session-1", studentId: "student-1", status: "present" },
  { id: "att-2", sessionId: "session-1", studentId: "student-2", status: "late" },
  { id: "att-3", sessionId: "session-2", studentId: "student-1", status: "absent", remarks: "Medical leave" },
];

export const demoCredentials = [
  { role: "Student", email: "student@nhu.edu", password: "student123" },
  { role: "Teacher", email: "teacher@nhu.edu", password: "teacher123" },
  { role: "Admin", email: "admin@nhu.edu", password: "admin123" },
];
