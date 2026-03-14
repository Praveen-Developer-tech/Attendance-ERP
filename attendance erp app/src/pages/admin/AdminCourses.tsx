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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  List,
  ListItem,
  ListItemText,
  Rating,
  Divider,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { nanoid } from "@reduxjs/toolkit";
import PageHeader from "../../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addCourse, deleteCourse, updateCourse } from "../../features/admin/adminSlice";
import { updateFeedback } from "../../features/feedback/feedbackSlice";
import type { Course } from "../../types";

const AdminCourses = () => {
  const dispatch = useAppDispatch();
  const { courses, departments, users } = useAppSelector((state) => state.admin);
  const feedback = useAppSelector((state) => state.feedback.items);
  const teachers = useMemo(() => users.filter((user) => user.role === "teacher"), [users]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<Partial<Course>>({ type: "core" });
  const [reviewsCourseId, setReviewsCourseId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number | null>(5);
  const [editComment, setEditComment] = useState("");

  const handleOpen = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setForm(course);
    } else {
      setEditingCourse(null);
      setForm({ type: "core" });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.code || !form.departmentId || !form.teacherId || !form.type) {
      return;
    }
    if (editingCourse) {
      dispatch(updateCourse({ ...(editingCourse as Course), ...form } as Course));
    } else {
      dispatch(
        addCourse({
          id: nanoid(),
          name: form.name,
          code: form.code,
          credits: Number(form.credits) || 3,
          departmentId: form.departmentId,
          teacherId: form.teacherId,
          semester: Number(form.semester) || 1,
          type: form.type,
        } as Course),
      );
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this course?")) {
      dispatch(deleteCourse(id));
    }
  };

  return (
    <Box>
      <PageHeader title="Course Management" subtitle="Create and assign courses" actions={<Button variant="contained" onClick={() => handleOpen()}>Add Course</Button>} />
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Reviews</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{departments.find((dept) => dept.id === course.departmentId)?.name}</TableCell>
                  <TableCell>{teachers.find((teacher) => teacher.id === course.teacherId)?.name}</TableCell>
                  <TableCell>{course.type.toUpperCase()}</TableCell>
                  <TableCell>
                    {(() => {
                      const courseFeedback = feedback.filter((f) => f.courseId === course.id);
                      const avg = courseFeedback.length ? Math.round((courseFeedback.reduce((sum, f) => sum + f.rating, 0) / courseFeedback.length) * 10) / 10 : 0;
                      return (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating value={avg} precision={0.5} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">{avg || "No ratings"}</Typography>
                        </Stack>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Button variant="text" size="small" onClick={() => setReviewsCourseId(course.id)}>
                      View ({feedback.filter((f) => f.courseId === course.id).length})
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(course)}>
                      <EditRoundedIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(course.id)}>
                      <DeleteRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingCourse ? "Edit Course" : "Add Course"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={form.name ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            <TextField label="Code" value={form.code ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Credits" type="number" value={form.credits ?? 3} onChange={(event) => setForm((prev) => ({ ...prev, credits: Number(event.target.value) }))} />
              <TextField label="Semester" type="number" value={form.semester ?? 1} onChange={(event) => setForm((prev) => ({ ...prev, semester: Number(event.target.value) }))} />
            </Stack>
            <TextField select label="Department" value={form.departmentId ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, departmentId: event.target.value }))}>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Teacher" value={form.teacherId ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, teacherId: event.target.value }))}>
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Type" value={form.type ?? "core"} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as Course["type"] }))}>
              <MenuItem value="core">Core</MenuItem>
              <MenuItem value="optional">Optional</MenuItem>
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

      <Dialog open={Boolean(reviewsCourseId)} onClose={() => setReviewsCourseId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Course Reviews</DialogTitle>
        <DialogContent>
          <List>
            {feedback
              .filter((item) => item.courseId === reviewsCourseId)
              .map((item) => (
                <>
                  <ListItem
                    key={item.id}
                    alignItems="flex-start"
                    secondaryAction={
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingReviewId(item.id);
                          setEditRating(item.rating);
                          setEditComment(item.comment ?? "");
                        }}
                      >
                        Edit
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontWeight={600}>{users.find((u) => u.id === item.studentId)?.name ?? "Student"}</Typography>
                          <Rating size="small" value={item.rating} readOnly />
                        </Stack>
                      }
                      secondary={item.comment || "No comment"}
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
            {feedback.filter((f) => f.courseId === reviewsCourseId).length === 0 && (
              <ListItem>
                <ListItemText primary="No reviews yet." />
              </ListItem>
            )}
          </List>

          {editingReviewId && (
            <Stack spacing={2} mt={2}>
              <Typography variant="subtitle1">Edit review</Typography>
              <Rating value={editRating} onChange={(_, val) => setEditRating(val)} />
              <TextField
                label="Comment"
                multiline
                minRows={3}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  onClick={() => {
                    setEditingReviewId(null);
                    setEditRating(5);
                    setEditComment("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!editRating || !editingReviewId) return;
                    dispatch(updateFeedback({ id: editingReviewId, rating: editRating as 1 | 2 | 3 | 4 | 5, comment: editComment }));
                    setEditingReviewId(null);
                  }}
                >
                  Save changes
                </Button>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewsCourseId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourses;
