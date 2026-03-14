import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Card, CardContent, Grid, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import PageHeader from "../../components/common/PageHeader";
import FilterBar from "../../components/common/FilterBar";
import AttendanceTable, { type AttendanceRow } from "../../components/common/AttendanceTable";
import { useAppSelector } from "../../hooks";
import { formatDate, formatTime } from "../../utils/date";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

dayjs.extend(isBetween);

const StudentAttendance = () => {
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.admin.courses);
  const enrollments = useAppSelector((state) => state.students.enrollments);
  const sessions = useAppSelector((state) => state.schedule.sessions);
  const attendanceRecords = useAppSelector((state) => state.attendance.records);
  const adminUsers = useAppSelector((state) => state.admin.users);

  const myCourseIds = enrollments.filter((enrollment) => enrollment.studentId === user?.id).map((item) => item.courseId);
  const courseOptions = courses.filter((course) => myCourseIds.includes(course.id));

  const [courseId, setCourseId] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [calendarMonth, setCalendarMonth] = useState(dayjs());

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      if (record.studentId !== user?.id) return false;
      const session = sessions.find((s) => s.id === record.sessionId);
      if (!session) return false;
      if (courseId && session.courseId !== courseId) return false;
      const withinRange = dayjs(session.date).isBetween(dayjs(fromDate).subtract(1, "day"), dayjs(toDate).add(1, "day"), null, "[]");
      return withinRange;
    });
  }, [attendanceRecords, sessions, user?.id, courseId, fromDate, toDate]);

  const mySessions = useMemo(
    () => sessions.filter((session) => myCourseIds.includes(session.courseId) && (!courseId || session.courseId === courseId)),
    [sessions, myCourseIds, courseId],
  );

  const sessionsByDate = useMemo(() => {
    return mySessions.reduce<Record<string, typeof mySessions>>((acc, session) => {
      const bucket = acc[session.date] ?? [];
      acc[session.date] = [...bucket, session];
      return acc;
    }, {});
  }, [mySessions]);

  const attendanceBySession = useMemo(() => {
    const map = new Map<string, (typeof attendanceRecords)[number]>();
    attendanceRecords.forEach((record) => {
      if (record.studentId === user?.id) {
        map.set(record.sessionId, record);
      }
    });
    return map;
  }, [attendanceRecords, user?.id]);

  const calendarDays = useMemo(() => {
    const start = calendarMonth.startOf("month").startOf("week");
    return Array.from({ length: 42 }, (_, index) => start.add(index, "day"));
  }, [calendarMonth]);

  useEffect(() => {
    if (!courseId && courseOptions.length) {
      setCourseId(courseOptions[0].id);
    }
  }, [courseId, courseOptions]);

  type DayStatus = "present" | "absent" | "late" | "pending" | "no-class";

  const getStatusForDate = useCallback(
    (date: dayjs.Dayjs): DayStatus => {
      const dateKey = date.format("YYYY-MM-DD");
      const daySessions = sessionsByDate[dateKey] ?? [];
      if (!daySessions.length) return "no-class";
      const records = daySessions
        .map((session) => attendanceBySession.get(session.id))
        .filter((record): record is NonNullable<typeof record> => Boolean(record));
      if (!records.length) return "pending";
      if (records.some((record) => record.status === "absent")) return "absent";
      if (records.some((record) => record.status === "late")) return "late";
      return "present";
    },
    [attendanceBySession, sessionsByDate],
  );

  const statusMeta: Record<DayStatus, { bg: string; border: string; label: string }> = {
    present: { bg: "rgba(34,197,94,0.18)", border: "rgba(16,185,129,0.5)", label: "Present" },
    absent: { bg: "rgba(248,113,113,0.25)", border: "rgba(239,68,68,0.4)", label: "Absent" },
    late: { bg: "rgba(250,204,21,0.25)", border: "rgba(251,191,36,0.4)", label: "Late" },
    pending: { bg: "rgba(99,102,241,0.2)", border: "rgba(99,102,241,0.4)", label: "Pending" },
    "no-class": { bg: "rgba(148,163,184,0.18)", border: "rgba(148,163,184,0.3)", label: "No Class" },
  };

  const tableRows: AttendanceRow[] = filteredRecords.map((record) => {
    const session = sessions.find((s) => s.id === record.sessionId);
    const course = courses.find((c) => c.id === session?.courseId);
    const teacher = session ? adminUsers.find((u) => u.id === course?.teacherId) : undefined;
    return {
      id: record.id,
      date: session ? formatDate(session.date) : "-",
      time: session ? `${formatTime(session.startTime)} - ${formatTime(session.endTime)}` : "-",
      course: course?.name ?? "-",
      teacher: teacher?.name ?? "-",
      status: record.status,
      remarks: record.remarks,
    };
  });

  const percent = (() => {
    const present = filteredRecords.filter((record) => record.status === "present").length;
    return filteredRecords.length ? Math.round((present / filteredRecords.length) * 100) : 0;
  })();

  const statusColor = percent >= 85 ? "success.main" : percent >= 75 ? "warning.main" : "error.main";

  return (
    <Box>
      <PageHeader title="My Attendance" subtitle="Track your attendance trends by course" />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <FilterBar>
                <TextField select label="Course" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                  {courseOptions.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField label="From" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} InputLabelProps={{ shrink: true }} />
                <TextField label="To" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} InputLabelProps={{ shrink: true }} />
              </FilterBar>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }} mb={3}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Overall Attendance
                  </Typography>
                  <Typography variant="h2" fontSize={32} color={statusColor}>
                    {percent}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {percent >= 85 ? "Excellent" : percent >= 75 ? "Maintain minimum threshold" : "Below academic requirement"}
                </Typography>
              </Stack>

              <AttendanceTable rows={tableRows} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="h3" fontSize={20}>
                    Attendance Calendar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {calendarMonth.format("MMMM YYYY")}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={() => setCalendarMonth((prev) => prev.subtract(1, "month"))}>
                    <ChevronLeftRoundedIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setCalendarMonth((prev) => prev.add(1, "month"))}>
                    <ChevronRightRoundedIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Box display="grid" gridTemplateColumns="repeat(7, minmax(0, 1fr))" gap={1} mb={2}>
                {["S", "M", "T", "W", "T", "F", "S"].map((label) => (
                  <Typography key={label} variant="caption" textAlign="center" color="text.secondary">
                    {label}
                  </Typography>
                ))}
                {calendarDays.map((day) => {
                  const status = getStatusForDate(day);
                  const isCurrentMonth = day.month() === calendarMonth.month();
                  return (
                    <Box
                      key={day.toString()}
                      sx={{
                        borderRadius: 1,
                        minHeight: 64,
                        border: `1px solid ${statusMeta[status].border}`,
                        backgroundColor: statusMeta[status].bg,
                        opacity: isCurrentMonth ? 1 : 0.4,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        p: 1,
                        fontWeight: 600,
                      }}
                    >
                      {day.date()}
                    </Box>
                  );
                })}
              </Box>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {Object.entries(statusMeta).map(([key, meta]) => (
                  <Stack direction="row" spacing={0.5} alignItems="center" key={key}>
                    <Box width={12} height={12} borderRadius="50%" bgcolor={meta.bg} border={`1px solid ${meta.border}`} />
                    <Typography variant="caption" color="text.secondary">
                      {meta.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentAttendance;
