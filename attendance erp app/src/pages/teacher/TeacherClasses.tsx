import { useState } from "react";
import { Box, Button, Card, CardContent, Grid, Stack, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Rating, Divider } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import { useAppSelector } from "../../hooks";
import { formatDateTime } from "../../utils/date";

const TeacherClasses = () => {
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.admin.courses.filter((course) => course.teacherId === user?.id));
  const enrollments = useAppSelector((state) => state.students.enrollments);
  const students = useAppSelector((state) => state.admin.users.filter((u) => u.role === "student"));
  const attendanceRecords = useAppSelector((state) => state.attendance.records);
  const sessions = useAppSelector((state) => state.schedule.sessions);
  const feedback = useAppSelector((state) => state.feedback.items);
  const allUsers = useAppSelector((state) => state.admin.users);
  const [reviewsCourseId, setReviewsCourseId] = useState<string | null>(null);

  const handleExport = (courseId: string) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return;
    const roster = enrollments.filter((enrollment) => enrollment.courseId === courseId);
    const rows = roster.map((enrollment) => {
      const student = students.find((s) => s.id === enrollment.studentId);
      const records = attendanceRecords.filter((record) => {
        const session = sessions.find((s) => s.id === record.sessionId);
        return session?.courseId === courseId && record.studentId === enrollment.studentId;
      });
      const present = records.filter((record) => record.status === "present").length;
      const percent = records.length ? Math.round((present / records.length) * 100) : 0;
      return `${student?.name},${student?.email},${percent}%`;
    });
    const csvContent = ["Name,Email,Attendance%", ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${course.code}-attendance.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <PageHeader title="My Classes" subtitle="Monitor course rosters and attendance" />
      <Grid container spacing={3}>
        {courses.map((course) => {
          const roster = enrollments.filter((enrollment) => enrollment.courseId === course.id);
          const sessionsForCourse = sessions.filter((session) => session.courseId === course.id);
          const attendanceForCourse = attendanceRecords.filter((record) => {
            const session = sessions.find((s) => s.id === record.sessionId);
            return session?.courseId === course.id;
          });
          const present = attendanceForCourse.filter((record) => record.status === "present").length;
          const percent = attendanceForCourse.length ? Math.round((present / attendanceForCourse.length) * 100) : 0;
          const courseFeedback = feedback.filter((item) => item.courseId === course.id);
          const avgRating = courseFeedback.length ? Math.round((courseFeedback.reduce((sum, item) => sum + item.rating, 0) / courseFeedback.length) * 10) / 10 : 0;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={course.id}>
              <Card>
                <CardContent>
                  <Typography variant="h3" fontSize={20} mb={1}>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {course.code} · {course.credits} credits · Semester {course.semester}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <Rating value={avgRating} precision={0.5} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {avgRating || "No ratings"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={3} mb={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Students
                      </Typography>
                      <Typography variant="h4">{roster.length}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Sessions
                      </Typography>
                      <Typography variant="h4">{sessionsForCourse.length}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Avg Attendance
                      </Typography>
                      <Typography variant="h4" color={percent >= 85 ? "success.main" : percent >= 75 ? "warning.main" : "error.main"}>
                        {percent}%
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack spacing={1} mb={2}>
                    {sessionsForCourse.slice(0, 3).map((session) => (
                      <Typography key={session.id} variant="body2" color="text.secondary">
                        {formatDateTime(session.date, session.startTime, session.endTime)} · {session.room}
                      </Typography>
                    ))}
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button variant="contained" onClick={() => handleExport(course.id)}>
                      Export CSV
                    </Button>
                    <Button variant="outlined" onClick={() => setReviewsCourseId(course.id)}>
                      View Reviews ({courseFeedback.length})
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={Boolean(reviewsCourseId)} onClose={() => setReviewsCourseId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Reviews</DialogTitle>
        <DialogContent>
          <List>
            {feedback
              .filter((item) => item.courseId === reviewsCourseId)
              .map((item) => {
                const reviewer = allUsers.find((u) => u.id === item.studentId);
                return (
                  <>
                    <ListItem key={item.id} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={600}>{reviewer?.name ?? "Student"}</Typography>
                            <Rating size="small" value={item.rating} readOnly />
                          </Stack>
                        }
                        secondary={item.comment || "No comment"}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                );
              })}
            {feedback.filter((f) => f.courseId === reviewsCourseId).length === 0 && (
              <ListItem>
                <ListItemText primary="No reviews yet." />
              </ListItem>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TeacherClasses;
