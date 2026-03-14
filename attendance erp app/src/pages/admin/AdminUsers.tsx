import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ToggleOnRoundedIcon from "@mui/icons-material/ToggleOnRounded";
import { nanoid } from "@reduxjs/toolkit";
import PageHeader from "../../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addUser, deleteUser, toggleUserStatus, updateUser } from "../../features/admin/adminSlice";
import { enrollCourse, dropCourse } from "../../features/students/studentsSlice";
import type { Role, User } from "../../types";

const roleFilters: (Role | "all")[] = ["all", "student", "teacher", "admin"];

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users, departments, courses } = useAppSelector((state) => state.admin);
  const enrollments = useAppSelector((state) => state.students.enrollments);
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [courseDialogUser, setCourseDialogUser] = useState<User | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const filteredUsers = useMemo(() => users.filter((user) => (roleFilter === "all" ? true : user.role === roleFilter)), [roleFilter, users]);

  const [form, setForm] = useState<Partial<User>>({ role: "student", status: "active" });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setForm(user);
    } else {
      setEditingUser(null);
      setForm({ role: "student", status: "active" });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.role) {
      return;
    }
    if (editingUser) {
      dispatch(updateUser({ ...(editingUser as User), ...form } as User));
    } else {
      dispatch(
        addUser({
          id: nanoid(),
          name: form.name,
          email: form.email,
          role: form.role,
          departmentId: form.departmentId,
          status: form.status ?? "active",
        } as User),
      );
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const openCourseDialog = (user: User) => {
    const current = enrollments.filter((enr) => enr.studentId === user.id).map((enr) => enr.courseId);
    setSelectedCourseIds(current);
    setCourseDialogUser(user);
  };

  const handleSaveCourses = () => {
    if (!courseDialogUser) return;
    const existing = enrollments.filter((enr) => enr.studentId === courseDialogUser.id);
    const existingIds = new Set(existing.map((enr) => enr.courseId));

    // Add new selections
    selectedCourseIds
      .filter((id) => !existingIds.has(id))
      .forEach((courseId) => {
        dispatch(
          enrollCourse({
            id: nanoid(),
            studentId: courseDialogUser.id,
            courseId,
            isCore: true,
          }),
        );
      });

    // Drop deselected courses
    existing
      .filter((enr) => !selectedCourseIds.includes(enr.courseId))
      .forEach((enr) => dispatch(dropCourse({ enrollmentId: enr.id })));

    setCourseDialogUser(null);
    setSelectedCourseIds([]);
  };

  return (
    <Box>
      <PageHeader title="User Management" subtitle="Add, edit, or deactivate users" actions={<Button variant="contained" onClick={() => handleOpenDialog()}>Add User</Button>} />
      <Card>
        <CardContent>
          <Tabs value={roleFilter} onChange={(_, value) => setRoleFilter(value)} variant="scrollable">
            {roleFilters.map((role) => (
              <Tab key={role} value={role} label={role === "all" ? "All" : role.toUpperCase()} />
            ))}
          </Tabs>
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.toUpperCase()}</TableCell>
                  <TableCell>{departments.find((dept) => dept.id === user.departmentId)?.name ?? "-"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color={user.status === "active" ? "success" : "inherit"}
                      startIcon={<ToggleOnRoundedIcon />}
                      onClick={() =>
                        dispatch(
                          toggleUserStatus({
                            id: user.id,
                            status: user.status === "active" ? "inactive" : "active",
                          }),
                        )
                      }
                    >
                      {user.status}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <EditRoundedIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                      <DeleteRoundedIcon />
                    </IconButton>
                    {user.role === "student" && (
                      <Button size="small" sx={{ ml: 1 }} variant="outlined" onClick={() => openCourseDialog(user)}>
                        Assign Courses
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={form.name ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            <TextField label="Email" value={form.email ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            <TextField select label="Role" value={form.role ?? "student"} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as Role }))}>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField select label="Department" value={form.departmentId ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, departmentId: event.target.value }))}>
              <MenuItem value="">Unassigned</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(courseDialogUser)} onClose={() => setCourseDialogUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign courses</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select courses for {courseDialogUser?.name}. Existing enrollments are pre-checked.
          </Typography>
          <FormGroup>
            {courses
              .filter((course) => !courseDialogUser?.departmentId || course.departmentId === courseDialogUser?.departmentId)
              .map((course) => (
                <FormControlLabel
                  key={course.id}
                  control={
                    <Checkbox
                      checked={selectedCourseIds.includes(course.id)}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setSelectedCourseIds((prev) =>
                          checked ? [...prev, course.id] : prev.filter((id) => id !== course.id),
                        );
                      }}
                    />
                  }
                  label={`${course.name} (${course.code})`}
                />
              ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCourseDialogUser(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCourses}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;
