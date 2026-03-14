import { useMemo, useState } from "react";
import { Box, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import PageHeader from "../../components/common/PageHeader";
import { useAppSelector } from "../../hooks";
import { formatTime } from "../../utils/date";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const StudentTimetable = () => {
  const user = useAppSelector((state) => state.auth.user);
  const enrollments = useAppSelector((state) => state.students.enrollments);
  const sessions = useAppSelector((state) => state.schedule.sessions);
  const courses = useAppSelector((state) => state.admin.courses);
  const teachers = useAppSelector((state) => state.admin.users.filter((u) => u.role === "teacher"));

  const myCourseIds = useMemo(
    () => enrollments.filter((enrollment) => enrollment.studentId === user?.id).map((enrollment) => enrollment.courseId),
    [enrollments, user?.id],
  );

  const timetable = useMemo(() => {
    return days.map((day) => ({
      day,
      sessions: sessions.filter(
        (session) =>
          dayjs(session.date).format("dddd") === day && myCourseIds.includes(session.courseId),
      ),
    }));
  }, [sessions, myCourseIds]);

  const [mobileDay, setMobileDay] = useState(days[0]);

  const renderSessionCard = (session: (typeof sessions)[number]) => {
    const course = courses.find((course) => course.id === session.courseId);
    const teacher = teachers.find((t) => t.id === course?.teacherId);
    return (
      <Box
        key={session.id}
        borderRadius={1.5}
        bgcolor="background.default"
        p={2}
        boxShadow={1}
        title={`${dayjs(session.date).format("DD MMM YYYY")} · ${formatTime(session.startTime)} - ${formatTime(session.endTime)} · ${session.room}`}
      >
        <Typography fontWeight={600}>{course?.code}</Typography>
        <Typography variant="body2" color="text.secondary">
          {course?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dayjs(session.date).format("DD MMM")} · {formatTime(session.startTime)} - {formatTime(session.endTime)} · {session.room}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {teacher?.name ?? "Faculty"}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <PageHeader title="Weekly Timetable" subtitle="View your classes across the week" />
      <Card>
        <CardContent>
          <Box display={{ xs: "block", md: "none" }} mb={2}>
            <TextField select label="Select Day" fullWidth value={mobileDay} onChange={(event) => setMobileDay(event.target.value)}>
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display={{ xs: "none", md: "grid" }} gridTemplateColumns="repeat(6, 1fr)" gap={2}>
            {timetable.map((column) => (
              <Box key={column.day}>
                <Typography variant="subtitle1" mb={1}>
                  {column.day}
                </Typography>
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {column.sessions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No sessions
                    </Typography>
                  ) : (
                    column.sessions.map((session) => renderSessionCard(session))
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          <Box display={{ xs: "flex", md: "none" }} flexDirection="column" gap={2}>
            {timetable
              .filter((column) => column.day === mobileDay)
              .map((column) => (
                <Box key={column.day}>
                  {column.sessions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No sessions for {column.day}
                    </Typography>
                  ) : (
                    column.sessions.map((session) => renderSessionCard(session))
                  )}
                </Box>
              ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentTimetable;
