import { useEffect, useMemo } from "react";
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { formatDateTime } from "../../utils/date";
import { setActiveSession, setPendingSessions } from "../../features/teachers/teachersSlice";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.admin.courses.filter((course) => course.teacherId === user?.id));
  const sessions = useAppSelector((state) => state.schedule.sessions.filter((session) => session.teacherId === user?.id));
  const attendanceRecords = useAppSelector((state) => state.attendance.records);
  const pendingSessionIds = useAppSelector((state) => state.teachers.pendingSessionIds);

  const today = dayjs().format("YYYY-MM-DD");
  const todaySessions = sessions.filter((session) => session.date === today);
  const recordedSessionIds = useMemo(() => new Set(attendanceRecords.map((record) => record.sessionId)), [attendanceRecords]);

  const computedPending = useMemo(
    () => todaySessions.filter((session) => !recordedSessionIds.has(session.id)).map((session) => session.id),
    [todaySessions, recordedSessionIds],
  );

  useEffect(() => {
    if (JSON.stringify(pendingSessionIds) !== JSON.stringify(computedPending)) {
      dispatch(setPendingSessions(computedPending));
    }
  }, [dispatch, computedPending, pendingSessionIds]);

  const handleTakeAttendance = (sessionId: string) => {
    dispatch(setActiveSession(sessionId));
    navigate(`/teacher/attendance/take?sessionId=${sessionId}`);
  };

  return (
    <Box>
      <PageHeader title="Faculty Dashboard" subtitle="Track classes and attendance tasks" />
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Total Courses" value={`${courses.length}`} helperText="Assigned to you" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Classes Today" value={`${todaySessions.length}`} helperText="Loaded from timetable" color="secondary" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Pending Attendance" value={`${pendingSessionIds.length}`} helperText="Mark attendance to sync" color="error" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h3" fontSize={20} mb={2}>
            Today's Schedule
          </Typography>
          {todaySessions.length === 0 ? (
            <Typography color="text.secondary">No classes scheduled today.</Typography>
          ) : (
            <Stack spacing={2}>
              {todaySessions.map((session) => {
                const course = courses.find((course) => course.id === session.courseId);
                const pending = pendingSessionIds.includes(session.id);
                return (
                  <Box key={session.id} borderRadius={1.5} p={2} border={1} borderColor="divider" display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                    <Box>
                      <Typography fontWeight={600}>{course?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(session.date, session.startTime, session.endTime)} · Room {session.room}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color={pending ? "warning.main" : "success.main"}>
                        {pending ? "Attendance pending" : "Completed"}
                      </Typography>
                      <Button variant="contained" onClick={() => handleTakeAttendance(session.id)}>
                        Take Attendance
                      </Button>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeacherDashboard;
