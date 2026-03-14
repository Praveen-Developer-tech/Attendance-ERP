import { useMemo, useState } from "react";
import { Box, Card, CardContent, Chip, Divider, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import PageHeader from "../../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateRequestStatus, removeRequest } from "../../features/requests/requestsSlice";
import { addUser } from "../../features/admin/adminSlice";
import { authService } from "../../features/auth/services/authService";
import { addNotification } from "../../features/notifications/notificationsSlice";
import { updateSession, deleteSession } from "../../features/schedule/scheduleSlice";
import { dropCourse } from "../../features/students/studentsSlice";
import { markAttendance } from "../../features/attendance/attendanceSlice";
import type { RequestItem, RequestStatus, Role, User } from "../../types";

const statusColor: Record<RequestStatus, "warning" | "success" | "error"> = {
  pending: "warning",
  approved: "success",
  declined: "error",
};

const AdminRequests = () => {
  const dispatch = useAppDispatch();
  const requests = useAppSelector((state) => state.requests.items);
  const users = useAppSelector((state) => state.admin.users);
  const sessions = useAppSelector((state) => state.schedule.sessions);
  const enrollments = useAppSelector((state) => state.students.enrollments);
  const [selected, setSelected] = useState<RequestItem | null>(null);

  const sorted = useMemo(() => requests.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)), [requests]);

  const handleAction = (status: RequestStatus) => {
    if (!selected) return;
    dispatch(updateRequestStatus({ id: selected.id, role: "admin", status }));

    const creator = users.find((u) => u.id === selected.createdBy || u.email === (selected.payload as { email?: string } | undefined)?.email);
    dispatch(
      addNotification({
        title: `Request ${status}`,
        description: `${selected.title} was ${status}.`,
        recipientUserId: creator?.id,
        recipientRole: creator?.role,
        link: creator ? `/${creator.role}/requests` : undefined,
      }),
    );

    if (status === "approved") {
      if (selected.type === "session-edit") {
        const payload = selected.payload as { sessionId: string; action?: string; date?: string; startTime?: string; endTime?: string; room?: string };
        const session = sessions.find((s) => s.id === payload.sessionId);
        if (session) {
          if (payload.action === "delete") {
            dispatch(deleteSession(payload.sessionId));
          } else {
            dispatch(
              updateSession({
                ...session,
                date: payload.date ?? session.date,
                startTime: payload.startTime ?? session.startTime,
                endTime: payload.endTime ?? session.endTime,
                room: payload.room ?? session.room,
              }),
            );
          }
        }
      }

      if (selected.type === "course-drop") {
        const payload = selected.payload as { courseId?: string; studentId?: string };
        const enrollment = enrollments.find((en) => en.courseId === payload.courseId && en.studentId === payload.studentId);
        if (enrollment) {
          dispatch(dropCourse({ enrollmentId: enrollment.id }));
          if (payload.studentId) {
            dispatch(
              addNotification({
                title: "Drop approved",
                description: "Your course drop request was approved.",
                recipientUserId: payload.studentId,
                link: "/student/courses",
              }),
            );
          }
        }
      }

      if (selected.type === "attendance-update") {
        const payload = selected.payload as { sessionId: string; updates?: { studentId: string; status: "present" | "absent" | "late"; sessionId?: string }[] };
        if (payload.updates?.length) {
          const updates = payload.updates.map((u) => ({
            sessionId: payload.sessionId,
            studentId: u.studentId,
            status: u.status,
          }));
          dispatch(markAttendance(updates));
        }
      }
    }

    if (status !== "pending") {
      dispatch(removeRequest(selected.id));
    }

    const isRegistration = selected.type === "student-registration" || selected.type === "teacher-registration";
    if (status === "approved" && isRegistration) {
      const payload = selected.payload as Partial<User> & { password?: string; role?: Role; email?: string; name?: string };
      if (payload?.email && payload?.name && payload?.role) {
        const exists = users.some((user) => user.email === payload.email);
        if (!exists) {
          const newUser: User = {
            id: nanoid(),
            name: payload.name,
            email: payload.email,
            role: payload.role,
            departmentId: payload.departmentId,
            batchId: payload.batchId,
            status: "active",
          } as User;
          dispatch(addUser(newUser));
          authService.saveCredential(payload.email, payload.password ?? "welcome123", payload.role);
          dispatch(
            addNotification({
              title: "Account approved",
              description: "You can now sign in to NHU ERP.",
              recipientUserId: newUser.id,
              recipientRole: newUser.role,
            }),
          );
        }
      }
    }
    setSelected(null);
  };

  return (
    <Box>
      <PageHeader title="Requests" subtitle="Approve or decline pending actions" />
      <Card>
        <CardContent>
          <Stack spacing={2} divider={<Divider flexItem />}>
            {sorted.length === 0 && <Typography color="text.secondary">No requests yet.</Typography>}
            {sorted.map((item) => (
              <Box key={item.id} display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
                <Box>
                  <Typography fontWeight={700}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                  <Typography variant="caption" color="text.secondary">Type: {item.type}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip label={item.status.toUpperCase()} color={statusColor[item.status]} />
                  <Button size="small" variant="outlined" onClick={() => setSelected(item)}>Review</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>{selected?.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2">{selected?.description}</Typography>
            <Typography variant="caption" color="text.secondary">Created: {selected?.createdAt}</Typography>

            {selected?.type === "attendance-update" && selected.payload ? (
              <Box p={1.5} border={1} borderColor="divider" borderRadius={1.5} bgcolor="background.default">
                <Typography variant="caption" color="text.secondary">Requested Attendance Updates</Typography>
                <Stack spacing={0.5} mt={1}>
                  {(selected.payload as { updates?: { studentId: string; status: string }[] }).updates?.map((u) => {
                    const student = users.find((usr) => usr.id === u.studentId);
                    return (
                      <Typography key={u.studentId} variant="body2">
                        {student?.name ?? u.studentId}: {u.status}
                      </Typography>
                    );
                  })}
                </Stack>
              </Box>
            ) : null}

            {selected?.type === "session-edit" && selected.payload ? (
              <Box p={1.5} border={1} borderColor="divider" borderRadius={1.5} bgcolor="background.default">
                <Typography variant="caption" color="text.secondary">Session Change</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {selected.payload.action === "delete"
                    ? "Delete session"
                    : `Date: ${(selected.payload as { date?: string }).date ?? "same"}\nStart: ${(selected.payload as { startTime?: string }).startTime ?? "same"}\nEnd: ${(selected.payload as { endTime?: string }).endTime ?? "same"}\nRoom: ${(selected.payload as { room?: string }).room ?? "same"}`}
                </Typography>
              </Box>
            ) : null}

            {selected?.type === "course-drop" && selected.payload ? (
              <Box p={1.5} border={1} borderColor="divider" borderRadius={1.5} bgcolor="background.default">
                <Typography variant="caption" color="text.secondary">Course Drop</Typography>
                <Typography variant="body2">Course: {(selected.payload as { courseId?: string }).courseId}</Typography>
                <Typography variant="body2">Student: {(selected.payload as { studentId?: string }).studentId}</Typography>
              </Box>
            ) : null}

            {(selected?.type === "student-registration" || selected?.type === "teacher-registration") && selected?.payload ? (
              <Box p={1.5} border={1} borderColor="divider" borderRadius={1.5} bgcolor="background.default">
                <Typography variant="caption" color="text.secondary">Registration Details</Typography>
                <Typography variant="body2">Name: {(selected.payload as { name?: string }).name}</Typography>
                <Typography variant="body2">Email: {(selected.payload as { email?: string }).email}</Typography>
                <Typography variant="body2">Role: {(selected.payload as { role?: string }).role}</Typography>
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button color="error" onClick={() => handleAction("declined")}>Decline</Button>
          <Button variant="contained" onClick={() => handleAction("approved")}>Approve</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminRequests;
