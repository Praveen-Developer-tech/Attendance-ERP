import { Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { Link as RouterLink } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { useAppSelector } from "../../hooks";

const AdminDashboard = () => {
  const { users, courses } = useAppSelector((state) => state.admin);
  const attendanceRecords = useAppSelector((state) => state.attendance.records);
  const students = users.filter((user) => user.role === "student");
  const teachers = users.filter((user) => user.role === "teacher");
  const present = attendanceRecords.filter((record) => record.status === "present").length;
  const avgAttendance = attendanceRecords.length ? Math.round((present / attendanceRecords.length) * 100) : 0;

  return (
    <Box>
      <PageHeader title="Admin Control Center" subtitle="High-level stats across NHU" />
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Students" value={`${students.length}`} helperText="Active" icon={<GroupsRoundedIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Teachers" value={`${teachers.length}`} helperText="Teaching this term" icon={<EmojiEventsRoundedIcon />} color="secondary" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Courses" value={`${courses.length}`} helperText="Across departments" icon={<MenuBookRoundedIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Avg Attendance" value={`${avgAttendance}%`} helperText="Across all sessions" icon={<AssessmentRoundedIcon />} color="success" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h3" fontSize={20} mb={2}>
            Quick Links
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" component={RouterLink} to="/admin/users">
              Manage Users
            </Button>
            <Button variant="outlined" component={RouterLink} to="/admin/courses">
              Manage Courses
            </Button>
            <Button variant="outlined" component={RouterLink} to="/admin/reports/attendance">
              View Reports
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
