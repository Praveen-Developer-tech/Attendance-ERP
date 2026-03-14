import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../hooks";
import PageHeader from "../../components/common/PageHeader";
import { formatDateTime } from "../../utils/date";
import { markAttendance } from "../../features/attendance/attendanceSlice";
import { markSessionComplete, setActiveSession } from "../../features/teachers/teachersSlice";
import { submitRequest } from "../../features/requests/requestsSlice";
import { addNotification } from "../../features/notifications/notificationsSlice";

const TakeAttendancePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const sessions = useAppSelector((state) => state.schedule.sessions.filter((session) => session.teacherId === user?.id));
  const courses = useAppSelector((state) => state.admin.courses);
  const enrollments = useAppSelector((state) => state.students.enrollments);
  const students = useAppSelector((state) => state.admin.users.filter((u) => u.role === "student"));
  const attendanceRecords = useAppSelector((state) => state.attendance.records);
  const activeSessionId = useAppSelector((state) => state.teachers.activeSessionId);
  const requests = useAppSelector((state) => state.requests.items);

  const initialSessionId = params.get("sessionId") ?? activeSessionId ?? sessions[0]?.id ?? "";
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessionId);
  const [statusMap, setStatusMap] = useState<Record<string, "present" | "absent" | "late">>({});
  const [editDialog, setEditDialog] = useState<{ open: boolean; sessionId?: string }>({ open: false });
  const [showRemarksField, setShowRemarksField] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: "info" | "success" | "error" }>({ open: false, message: "", severity: "info" });

  const selectedSession = sessions.find((session) => session.id === selectedSessionId) ?? sessions[0];
  const [lastSessionId, setLastSessionId] = useState<string | undefined>(selectedSession?.id);
  const now = dayjs();

  const getSessionRange = (session?: typeof sessions[number]) => {
    if (!session) {
      const invalid = dayjs("invalid-date");
      return { start: invalid, end: invalid };
    }
    const start = dayjs(`${session.date} ${session.startTime}`, "YYYY-MM-DD HH:mm", true);
    const end = dayjs(`${session.date} ${session.endTime}`, "YYYY-MM-DD HH:mm", true);
    return { start, end };
  };

  useEffect(() => {
    if (!selectedSession && sessions.length > 0) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [selectedSession, sessions]);

  useEffect(() => {
    if (selectedSessionId) {
      dispatch(setActiveSession(selectedSessionId));
    }
  }, [dispatch, selectedSessionId]);

  useEffect(() => () => {
    dispatch(setActiveSession(undefined));
  }, [dispatch]);

  const roster = useMemo(() => {
    if (!selectedSession) return [] as typeof students;
    return enrollments
      .filter((enrollment) => enrollment.courseId === selectedSession.courseId)
      .map((enrollment) => students.find((student) => student.id === enrollment.studentId))
      .filter((student): student is NonNullable<typeof student> => Boolean(student));
  }, [enrollments, students, selectedSession]);

  const existingRecords = useMemo(
    () => attendanceRecords.filter((record) => record.sessionId === selectedSession?.id),
    [attendanceRecords, selectedSession?.id],
  );

  useEffect(() => {
    if (!selectedSession) return;
    const switchingSession = lastSessionId !== selectedSession.id;

    setStatusMap((prev) => {
      const next: Record<string, "present" | "absent" | "late"> = { ...prev };

      roster.forEach((student) => {
        const record = existingRecords.find((item) => item.studentId === student.id);
        const initial = record?.status ?? "present";

        // Only overwrite when switching sessions or when the student has no status yet
        if (switchingSession || next[student.id] === undefined) {
          next[student.id] = initial;
        }
      });

      return next;
    });

    setLastSessionId(selectedSession.id);
    setShowRemarksField(false);
    setRemarks("");
  }, [selectedSession, roster, existingRecords, lastSessionId]);

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: "present" | "absent" | "late") => {
    const updated: Record<string, typeof status> = {};
    roster.forEach((student) => {
      updated[student.id] = status;
    });
    setStatusMap(updated);
  };

  const handleSubmit = () => {
    if (!selectedSession || !user) return;
    const updates = roster.map((student) => ({
      sessionId: selectedSession.id,
      studentId: student.id,
      status: statusMap[student.id] ?? "present",
    }));

    const { end } = getSessionRange(selectedSession);
    const sessionIsPast = end.isValid() ? end.isBefore(now) : dayjs(selectedSession.date).isBefore(now, "day");

    if (sessionIsPast) {
      dispatch(
        submitRequest({
          type: "attendance-update",
          title: `Attendance update for ${selectedCourse?.name ?? "class"}`,
          description: `Requested changes for ${formatDateTime(selectedSession.date, selectedSession.startTime, selectedSession.endTime)}`,
          createdBy: user.id,
          createdForRole: "admin",
          approvers: ["admin"],
          approvals: { admin: "pending" },
          payload: { sessionId: selectedSession.id, updates, date: selectedSession.date, startTime: selectedSession.startTime, endTime: selectedSession.endTime },
          remarks,
        }),
      );
      dispatch(
        addNotification({
          title: "Attendance change submitted",
          description: `${user.name} sent changes for ${selectedCourse?.name ?? "a class"}.`,
          recipientRole: "admin",
          link: "/admin/requests",
        }),
      );
      setEditDialog({ open: false });
      setSnackbar({ open: true, message: "Sent for approval. Admin will apply changes once approved.", severity: "info" });
      return;
    }

    dispatch(markAttendance(updates));
    dispatch(markSessionComplete(selectedSession.id));
    dispatch(setActiveSession(undefined));
    setSnackbar({ open: true, message: "Attendance saved.", severity: "success" });
    navigate("/teacher/dashboard");
  };

  const { start: selectedStart, end: selectedEnd } = getSessionRange(selectedSession);
  const isOngoing = selectedSession && selectedStart.isValid() && selectedEnd.isValid()
    ? selectedStart.isBefore(now) && selectedEnd.isAfter(now)
    : false;

  const pastSessions = sessions.filter((session) => {
    const { end } = getSessionRange(session);
    return end.isValid() ? end.isBefore(now) : dayjs(session.date).isBefore(now, "day");
  });
  const selectedCourse = courses.find((course) => course.id === selectedSession?.courseId);
  const canEditLive = Boolean(isOngoing);
  const requestForSession = (sessionId: string) => requests.find((req) => req.type === "attendance-update" && (req.payload as { sessionId?: string }).sessionId === sessionId);
  const requestStatusForSession = (sessionId: string) => requestForSession(sessionId)?.status;

  return (
    <Box>
      <PageHeader
        title="Take Attendance"
        subtitle={selectedCourse ? `${selectedCourse.name} · ${formatDateTime(selectedSession?.date ?? "", selectedSession?.startTime ?? "", selectedSession?.endTime ?? "")}` : "Select a session"}
        actions={
          <Button variant="outlined" onClick={() => navigate("/teacher/dashboard")}>
            Back
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Session
              </Typography>
              <TextField select fullWidth value={selectedSessionId} onChange={(event) => setSelectedSessionId(event.target.value)}>
                {sessions.map((session) => {
                  const course = courses.find((item) => item.id === session.courseId);
                  return (
                    <MenuItem key={session.id} value={session.id}>
                      {course?.name} · {formatDateTime(session.date, session.startTime, session.endTime)}
                    </MenuItem>
                  );
                })}
              </TextField>
              <Box mt={2} p={2} borderRadius={1.5} border={1} borderColor="divider" bgcolor={isOngoing ? "success.light" : "background.default"}>
                <Typography variant="subtitle2" fontWeight={600}>Ongoing Status</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedSession ? (isOngoing ? "Class is in progress. Live attendance can be taken." : "Attendance can be marked only during live sessions.") : "Select a session"}
                </Typography>
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle1" color="text.secondary">
                  Quick Actions
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Button variant="contained" onClick={() => handleMarkAll("present")} disabled={!canEditLive}>Mark all present</Button>
                  <Button variant="outlined" color="warning" onClick={() => handleMarkAll("late")} disabled={!canEditLive}>
                    Mark all late
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Past Classes (edit requires approval)
              </Typography>
              <Stack spacing={1.5} divider={<Divider flexItem />}>
                {pastSessions.length === 0 && <Typography variant="body2" color="text.secondary">No past classes yet.</Typography>}
                {pastSessions.map((session) => {
                  const course = courses.find((c) => c.id === session.courseId);
                  const status = requestStatusForSession(session.id);
                  return (
                    <Stack key={session.id} spacing={0.5}>
                      <Typography fontWeight={600}>{course?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{formatDateTime(session.date, session.startTime, session.endTime)} · Room {session.room}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedSessionId(session.id);
                            setEditDialog({ open: true, sessionId: session.id });
                          }}
                        >
                          Edit Attendance
                        </Button>
                        {status && <Typography variant="caption" color="text.secondary">Request: {status}</Typography>}
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ position: "relative" }}>
            {!canEditLive && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(255,255,255,0.7)",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  px: 2,
                }}
              >
                <Typography color="text.secondary" fontWeight={600}>
                  Attendance can be marked only during live sessions.
                </Typography>
              </Box>
            )}
            <Paper sx={{ borderRadius: 2, overflowX: "auto", opacity: canEditLive ? 1 : 0.6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Roll No</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roster.map((student, index) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{`NHU-${index + 1}`}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircleRoundedIcon color="success" />
                          <Box>
                            <Typography fontWeight={600}>{student?.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {student?.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {(["present", "absent", "late"] as const).map((status) => (
                            <Button
                              key={status}
                              variant={statusMap[student.id] === status ? "contained" : "outlined"}
                              color={status === "present" ? "success" : status === "late" ? "warning" : "error"}
                              size="small"
                              onClick={() => handleStatusChange(student.id, status)}
                              disabled={!canEditLive}
                            >
                              {status.charAt(0).toUpperCase()}
                            </Button>
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
          <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
            <Button variant="outlined" onClick={() => navigate("/teacher/dashboard")}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={!canEditLive}>
              Save Attendance
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography variant="body2" color="text.secondary">
              Update attendance for this past class. Changes will be sent to admin for approval.
            </Typography>
            <Paper sx={{ borderRadius: 2, overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Roll No</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roster.map((student, index) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{`NHU-${index + 1}`}</TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{student?.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{student?.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {(["present", "absent", "late"] as const).map((status) => (
                            <Button
                              key={status}
                              variant={statusMap[student.id] === status ? "contained" : "outlined"}
                              color={status === "present" ? "success" : status === "late" ? "warning" : "error"}
                              size="small"
                              onClick={() => handleStatusChange(student.id, status)}
                            >
                              {status.charAt(0).toUpperCase()}
                            </Button>
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {showRemarksField && (
              <TextField
                label="Remarks for admin"
                multiline
                minRows={3}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Explain why the changes are needed"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={() => setEditDialog({ open: false })}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!showRemarksField) {
                setShowRemarksField(true);
                return;
              }
              handleSubmit();
            }}
          >
            {showRemarksField ? "Submit to admin" : "Submit for approval"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "", severity: "info" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity ?? "info"} onClose={() => setSnackbar({ open: false, message: "", severity: "info" })} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TakeAttendancePage;
