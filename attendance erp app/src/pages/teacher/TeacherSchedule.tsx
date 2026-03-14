import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import PageHeader from "../../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addSession, updateSession, deleteSession } from "../../features/schedule/scheduleSlice";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { submitRequest } from "../../features/requests/requestsSlice";
import { addNotification } from "../../features/notifications/notificationsSlice";

const TeacherSchedule = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.admin.courses.filter((course) => course.teacherId === user?.id));
  const sessions = useAppSelector((state) => state.schedule.sessions.filter((session) => session.teacherId === user?.id));
  const requests = useAppSelector((state) => state.requests.items);
  const [form, setForm] = useState({
    courseId: courses[0]?.id ?? "",
    date: dayjs().format("YYYY-MM-DD"),
    startTime: "10:00",
    endTime: "11:00",
    room: "NHU-101",
    type: "extra" as "regular" | "extra" | "optional" | "event",
    notes: "",
    frequency: "once" as "once" | "twice" | "weekdays",
  });
  const [error, setError] = useState<string | undefined>();
  const [calendarMonth, setCalendarMonth] = useState(dayjs());
  const [editDialog, setEditDialog] = useState<{ open: boolean; sessionId?: string; date: string; startTime: string; endTime: string; room: string } | null>(null);
  const [editRemarks, setEditRemarks] = useState("");

  useEffect(() => {
    if (!form.courseId && courses.length) {
      setForm((prev) => ({ ...prev, courseId: courses[0].id }));
    }
  }, [courses, form.courseId]);

  const upcomingSessions = useMemo(
    () =>
      sessions
        .slice()
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
        .slice(0, 10),
    [sessions],
  );

  const calendarDays = useMemo(() => {
    const start = calendarMonth.startOf("month").startOf("week");
    return Array.from({ length: 42 }, (_, index) => start.add(index, "day"));
  }, [calendarMonth]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const generateDates = () => {
    const start = dayjs(form.date);
    if (!start.isValid()) return [] as dayjs.Dayjs[];
    if (form.frequency === "once") return [start];
    if (form.frequency === "twice") {
      const second = start.add(2, "day");
      const adjSecond = second.day() === 6 ? second.add(2, "day") : second.day() === 0 ? second.add(1, "day") : second;
      return [start, adjSecond];
    }
    // weekdays: next 10 working days from start
    const days: dayjs.Dayjs[] = [];
    let cursor = start;
    while (days.length < 10) {
      const day = cursor.day();
      if (day !== 0 && day !== 6) {
        days.push(cursor);
      }
      cursor = cursor.add(1, "day");
    }
    return days;
  };

  const handleAdd = () => {
    if (!form.courseId || !form.date) {
      setError("Course and date are required");
      return;
    }
    const dates = generateDates();
    const overlap = sessions.some((session) =>
      dates.some((d) =>
        session.date === d.format("YYYY-MM-DD") &&
        !(form.endTime <= session.startTime || form.startTime >= session.endTime),
      ),
    );
    if (overlap) {
      setError("This time overlaps with an existing session");
      return;
    }
    setError(undefined);
    dates.forEach((d) => {
      dispatch(
        addSession({
          courseId: form.courseId,
          teacherId: user!.id,
          date: d.format("YYYY-MM-DD"),
          startTime: form.startTime,
          endTime: form.endTime,
          room: form.room,
          type: form.type,
          notes: form.notes,
        }),
      );
    });
  };

  const requestStatusForSession = (sessionId: string) =>
    requests.find((req) => req.type === "session-edit" && req.payload.sessionId === sessionId)?.status;

  const isPastSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return false;
    return dayjs(session.date).isBefore(dayjs(), "day");
  };

  const openEdit = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;
    setEditDialog({
      open: true,
      sessionId,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      room: session.room,
    });
    setEditRemarks("");
  };

  const handleEditSubmit = () => {
    if (!editDialog?.sessionId) return;
    if (isPastSession(editDialog.sessionId)) {
      dispatch(
        submitRequest({
          type: "session-edit",
          title: "Session update request",
          description: "Edit class schedule",
          createdBy: user!.id,
          createdForRole: "admin",
          approvers: ["admin"],
          approvals: { admin: "pending" },
          payload: {
            sessionId: editDialog.sessionId,
            date: editDialog.date,
            startTime: editDialog.startTime,
            endTime: editDialog.endTime,
            room: editDialog.room,
          },
          remarks: editRemarks,
        }),
      );
      const session = sessions.find((s) => s.id === editDialog.sessionId);
      const course = courses.find((c) => c.id === session?.courseId);
      dispatch(
        addNotification({
          title: "Session edit request",
          description: `${user?.name} requested edits to ${course?.name ?? "a session"}.`,
          recipientRole: "admin",
          link: "/admin/requests",
        }),
      );
    } else {
      const session = sessions.find((s) => s.id === editDialog.sessionId);
      if (session) {
        dispatch(
          updateSession({
            ...session,
            date: editDialog.date,
            startTime: editDialog.startTime,
            endTime: editDialog.endTime,
            room: editDialog.room,
          }),
        );
      }
    }
    setEditDialog(null);
  };

  const handleDeleteSubmit = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    const course = courses.find((c) => c.id === session?.courseId);
    if (isPastSession(sessionId)) {
      dispatch(
        submitRequest({
          type: "session-edit",
          title: "Session delete request",
          description: "Delete class session",
          createdBy: user!.id,
          createdForRole: "admin",
          approvers: ["admin"],
          approvals: { admin: "pending" },
          payload: { sessionId, action: "delete" },
        }),
      );
      dispatch(
        addNotification({
          title: "Session delete request",
          description: `${user?.name} requested to delete ${course?.name ?? "a session"}.`,
          recipientRole: "admin",
          link: "/admin/requests",
        }),
      );
    } else {
      dispatch(deleteSession(sessionId));
    }
  };

  return (
    <Box>
      <PageHeader title="Schedule & Timetable" subtitle="Add extra classes and events" />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <TextField select label="Course" value={form.courseId} onChange={(event) => handleChange("courseId", event.target.value)}>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField label="Date" type="date" value={form.date} onChange={(event) => handleChange("date", event.target.value)} InputLabelProps={{ shrink: true }} />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="Start" type="time" value={form.startTime} onChange={(event) => handleChange("startTime", event.target.value)} InputLabelProps={{ shrink: true }} />
                  <TextField label="End" type="time" value={form.endTime} onChange={(event) => handleChange("endTime", event.target.value)} InputLabelProps={{ shrink: true }} />
                </Stack>
                <TextField label="Room" value={form.room} onChange={(event) => handleChange("room", event.target.value)} />
                <TextField select label="Type" value={form.type} onChange={(event) => handleChange("type", event.target.value)}>
                  <MenuItem value="regular">Regular</MenuItem>
                  <MenuItem value="extra">Extra</MenuItem>
                  <MenuItem value="optional">Optional</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                </TextField>
                <TextField select label="Frequency" value={form.frequency} onChange={(event) => handleChange("frequency", event.target.value)}>
                  <MenuItem value="once">Once</MenuItem>
                  <MenuItem value="twice">Twice (this week)</MenuItem>
                  <MenuItem value="weekdays">All working days (next 2 weeks)</MenuItem>
                </TextField>
                <TextField label="Notes" multiline minRows={3} value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} />
                {error && <Alert severity="warning">{error}</Alert>}
                <Button variant="contained" onClick={handleAdd}>
                  Add Session
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h3" fontSize={18} mb={2}>Edit Sessions (admin approval)</Typography>
              <Stack spacing={1.5} divider={<Divider flexItem />}>
                {sessions.length === 0 && <Typography color="text.secondary">No sessions yet.</Typography>}
                {sessions.map((session) => {
                  const course = courses.find((c) => c.id === session.courseId);
                  const status = requestStatusForSession(session.id);
                  return (
                    <Stack key={session.id} spacing={0.5}>
                      <Typography fontWeight={600}>{course?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{dayjs(session.date).format("DD MMM YYYY")} · {session.startTime} - {session.endTime} · {session.room}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="outlined" onClick={() => openEdit(session.id)}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleDeleteSubmit(session.id)}>Delete</Button>
                        {status && <Chip size="small" label={`Request: ${status}`} color={status === "approved" ? "success" : status === "pending" ? "warning" : "error"} />}
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h3" fontSize={20}>Schedule Calendar</Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={() => setCalendarMonth((prev) => prev.subtract(1, "month"))}><ChevronLeftRoundedIcon /></IconButton>
                  <IconButton size="small" onClick={() => setCalendarMonth((prev) => prev.add(1, "month"))}><ChevronRightRoundedIcon /></IconButton>
                </Stack>
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={1}>{calendarMonth.format("MMMM YYYY")}</Typography>
              <Box display="grid" gridTemplateColumns="repeat(7, minmax(0, 1fr))" gap={1} mb={2}>
                {["S","M","T","W","T","F","S"].map((label) => (
                  <Typography key={label} variant="caption" textAlign="center" color="text.secondary">{label}</Typography>
                ))}
                {calendarDays.map((day) => {
                  const isWeekend = day.day() === 0 || day.day() === 6;
                  const daySessions = sessions.filter((s) => s.date === day.format("YYYY-MM-DD"));
                  return (
                    <Box
                      key={day.toString()}
                      sx={{
                        borderRadius: 1,
                        minHeight: 70,
                        border: isWeekend ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(148,163,184,0.4)",
                        backgroundColor: isWeekend ? "rgba(248,113,113,0.15)" : "rgba(124,140,255,0.08)",
                        opacity: day.month() === calendarMonth.month() ? 1 : 0.4,
                        p: 0.5,
                      }}
                    >
                      <Typography variant="caption" fontWeight={600}>{day.date()}</Typography>
                      <Stack spacing={0.5} mt={0.5}>
                        {daySessions.map((s) => {
                          const course = courses.find((c) => c.id === s.courseId);
                          return (
                            <Typography key={s.id} variant="caption" title={`${course?.name} · ${s.startTime}-${s.endTime} · ${s.room}`}>
                              {course?.code ?? ""} {s.startTime}
                            </Typography>
                          );
                        })}
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h3" fontSize={20} mb={2}>Upcoming Sessions</Typography>
              <Stack spacing={2}>
                {upcomingSessions.map((session) => {
                  const course = courses.find((course) => course.id === session.courseId);
                  const status = requestStatusForSession(session.id);
                  return (
                    <Box key={session.id} borderRadius={1.5} border={1} borderColor="divider" p={2}>
                      <Typography fontWeight={600}>{course?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(session.date).format("ddd, DD MMM")} · {session.startTime} - {session.endTime} · {session.room}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.type.toUpperCase()}
                      </Typography>
                      {status && <Chip size="small" label={`Request: ${status}`} color={status === "approved" ? "success" : status === "pending" ? "warning" : "error"} sx={{ mt: 1 }} />}
                      {session.notes && (
                        <Typography variant="body2" color="text.secondary">
                          {session.notes}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={Boolean(editDialog)}
        onClose={() => setEditDialog(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Edit Session
          <IconButton size="small" onClick={() => setEditDialog(null)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editDialog && (
            <Stack spacing={2} mt={1}>
              <TextField label="Date" type="date" value={editDialog.date} onChange={(e) => setEditDialog({ ...editDialog, date: e.target.value })} InputLabelProps={{ shrink: true }} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Start" type="time" value={editDialog.startTime} onChange={(e) => setEditDialog({ ...editDialog, startTime: e.target.value })} InputLabelProps={{ shrink: true }} />
                <TextField label="End" type="time" value={editDialog.endTime} onChange={(e) => setEditDialog({ ...editDialog, endTime: e.target.value })} InputLabelProps={{ shrink: true }} />
              </Stack>
              <TextField label="Room" value={editDialog.room} onChange={(e) => setEditDialog({ ...editDialog, room: e.target.value })} />
              <TextField label="Remarks" multiline minRows={3} value={editRemarks} onChange={(e) => setEditRemarks(e.target.value)} />
              <Typography variant="body2" color="text.secondary">Changes require admin approval. Status will show as pending until reviewed.</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={() => setEditDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Submit Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherSchedule;
