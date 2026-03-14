import { useMemo, useState } from "react";
import { Box, Button, Card, CardContent, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import PageHeader from "../../components/common/PageHeader";
import { useAppSelector } from "../../hooks";

dayjs.extend(isBetween);

const AdminAttendanceReports = () => {
  const { departments, courses } = useAppSelector((state) => state.admin);
  const attendanceRecords = useAppSelector((state) => state.attendance.records);
  const sessions = useAppSelector((state) => state.schedule.sessions);

  const [filters, setFilters] = useState({
    departmentId: "",
    courseId: "",
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });

  const filteredCourses = useMemo(
    () => courses.filter((course) => (filters.departmentId ? course.departmentId === filters.departmentId : true)),
    [courses, filters.departmentId],
  );

  const summary = useMemo(() => {
    return filteredCourses
      .filter((course) => (filters.courseId ? course.id === filters.courseId : true))
      .map((course) => {
        const courseSessions = sessions.filter((session) => {
          const matchesCourse = session.courseId === course.id;
          const withinRange = dayjs(session.date).isBetween(dayjs(filters.from).subtract(1, "day"), dayjs(filters.to).add(1, "day"), null, "[]");
          return matchesCourse && withinRange;
        });
        const records = attendanceRecords.filter((record) => courseSessions.some((session) => session.id === record.sessionId));
        const present = records.filter((record) => record.status === "present").length;
        const totalStudents = records.reduce((acc, record) => (acc.includes(record.studentId) ? acc : [...acc, record.studentId]), [] as string[]).length;
        const percent = records.length ? Math.round((present / records.length) * 100) : 0;
        return {
          course,
          average: percent,
          sessions: courseSessions.length,
          totalStudents,
          absences: records.filter((record) => record.status === "absent").length,
        };
      });
  }, [filteredCourses, filters.courseId, filters.from, filters.to, attendanceRecords, sessions]);

  const handleExport = () => {
    const csv = ["Course,Average %,Sessions,Students,Absences", ...summary.map((row) => `${row.course.name},${row.average},${row.sessions},${row.totalStudents},${row.absences}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance-report.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <PageHeader
        title="Attendance Reports"
        subtitle="Filter across departments and export summaries"
        actions={
          <Button variant="outlined" onClick={handleExport}>
            Export CSV
          </Button>
        }
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField select label="Department" value={filters.departmentId} onChange={(event) => setFilters((prev) => ({ ...prev, departmentId: event.target.value, courseId: "" }))}>
              <MenuItem value="">All</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Course" value={filters.courseId} onChange={(event) => setFilters((prev) => ({ ...prev, courseId: event.target.value }))}>
              <MenuItem value="">All</MenuItem>
              {filteredCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="From" type="date" value={filters.from} InputLabelProps={{ shrink: true }} onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))} />
            <TextField label="To" type="date" value={filters.to} InputLabelProps={{ shrink: true }} onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Average %</TableCell>
                <TableCell>Sessions</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Absences</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((row) => (
                <TableRow key={row.course.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{row.course.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {row.course.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.average}%</TableCell>
                  <TableCell>{row.sessions}</TableCell>
                  <TableCell>{row.totalStudents}</TableCell>
                  <TableCell>{row.absences}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminAttendanceReports;
