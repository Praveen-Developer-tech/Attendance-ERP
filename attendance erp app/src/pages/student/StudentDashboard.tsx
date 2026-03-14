import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import dayjs from "dayjs";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { useAppSelector } from "../../hooks";
import { formatDate, formatDateTime } from "../../utils/date";

const StudentDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.admin.courses);
  const enrollments = useAppSelector((state) => state.students.enrollments);
  const sessions = useAppSelector((state) => state.schedule.sessions);
  const attendanceRecords = useAppSelector((state) => state.attendance.records);
  const teachers = useAppSelector((state) => state.admin.users.filter((u) => u.role === "teacher"));

  const myEnrollments = enrollments.filter((enrollment) => enrollment.studentId === user?.id);
  const courseMap = courses.reduce<Record<string, typeof courses[number]>>((acc, course) => ({ ...acc, [course.id]: course }), {});
  const sessionCourseMap = sessions.reduce<Record<string, typeof courses[number]>>(
    (acc, session) => ({ ...acc, [session.id]: courseMap[session.courseId] }),
    {},
  );

  const studentRecords = attendanceRecords.filter((record) => record.studentId === user?.id);
  const presentCount = studentRecords.filter((record) => record.status === "present").length;
  const overallAttendance = studentRecords.length ? Math.round((presentCount / studentRecords.length) * 100) : 0;
  const today = dayjs().format("YYYY-MM-DD");
  const todayClasses = sessions.filter((session) => session.date === today && myEnrollments.some((enrollment) => enrollment.courseId === session.courseId));
  const absencesThisMonth = studentRecords.filter((record) => {
    if (record.status !== "absent") return false;
    const session = sessions.find((s) => s.id === record.sessionId);
    return session ? dayjs(session.date).isSame(dayjs(), "month") : false;
  }).length;

  const attendanceByCourse = myEnrollments.map((enrollment) => {
    const course = courseMap[enrollment.courseId];
    const records = studentRecords.filter((record) => sessionCourseMap[record.sessionId]?.id === enrollment.courseId);
    const present = records.filter((record) => record.status === "present").length;
    const percent = records.length ? Math.round((present / records.length) * 100) : 0;
    return { course, percent, total: records.length };
  });

  return (
    <Box>
      <PageHeader title={`Welcome back, ${user?.name ?? "Student"}`} subtitle={formatDate(new Date().toISOString())} />
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Overall Attendance" value={`${overallAttendance}%`} helperText="Target ≥ 85%" changeText="+4%" icon={<TrendingUpRoundedIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Today's Classes" value={`${todayClasses.length}`} helperText="Don't miss any sessions" color="secondary" icon={<CalendarMonthRoundedIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Absences this month" value={`${absencesThisMonth}`} helperText="Stay within attendance policy" color="error" icon={<AccessTimeRoundedIcon />} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h3" fontSize={20} mb={2}>
                Today's Timetable
              </Typography>
              {todayClasses.length === 0 ? (
                <Typography color="text.secondary">No classes scheduled today.</Typography>
              ) : (
                <List>
                  {todayClasses.map((session) => {
                    const course = courseMap[session.courseId];
                    const teacher = teachers.find((t) => t.id === session.teacherId);
                    return (
                      <Box key={session.id} component="li" sx={{ listStyle: "none" }}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>{course?.code?.slice(0, 2) ?? "NH"}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={course?.name}
                            secondary={
                              <Stack spacing={0.5} mt={1}>
                                <Typography variant="body2" color="text.primary">
                                  {formatDateTime(session.date, session.startTime, session.endTime)} · Room {session.room}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {teacher?.name ?? "Faculty"}
                                </Typography>
                              </Stack>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </Box>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h3" fontSize={20} mb={2}>
                Attendance by Course
              </Typography>
              <Stack spacing={2}>
                {attendanceByCourse.map(({ course, percent, total }) => (
                  <Box key={course?.id} display="flex" alignItems="center" justifyContent="space-between" p={2} borderRadius={1.5} bgcolor="background.default">
                    <Box>
                      <Typography fontWeight={600}>{course?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {total} sessions tracked
                      </Typography>
                    </Box>
                    <Chip label={`${percent}%`} color={percent >= 85 ? "success" : percent >= 75 ? "warning" : "error"} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
