import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
  TextField,
  Rating,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { enrollCourse } from "../../features/students/studentsSlice";
import { submitRequest } from "../../features/requests/requestsSlice";
import { submitFeedback } from "../../features/feedback/feedbackSlice";
import { addNotification } from "../../features/notifications/notificationsSlice";
import { updateFeedback } from "../../features/feedback/feedbackSlice";
import PageHeader from "../../components/common/PageHeader";

const StudentCourses = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.admin.courses);
  const enrollments = useAppSelector((state) => state.students.enrollments);
  const teachers = useAppSelector((state) => state.admin.users.filter((u) => u.role === "teacher"));
  const feedback = useAppSelector((state) => state.feedback.items);
  const users = useAppSelector((state) => state.admin.users);

  const myEnrollments = enrollments.filter((enrollment) => enrollment.studentId === user?.id);
  const enrolledCourseIds = new Set(myEnrollments.map((enrollment) => enrollment.courseId));

  const [dialogCourseId, setDialogCourseId] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<"enroll" | "drop" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [ratingDialog, setRatingDialog] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState<number | null>(5);
  const [ratingText, setRatingText] = useState("");
  const [reviewsDialog, setReviewsDialog] = useState<string | null>(null);

  const optionalCourses = useMemo(() => courses.filter((course) => course.type === "optional"), [courses]);

  const handleAction = () => {
    if (!dialogCourseId || !user || !dialogMode) return;
    if (dialogMode === "enroll") {
      dispatch(
        enrollCourse({
          id: nanoid(),
          studentId: user.id,
          courseId: dialogCourseId,
          isCore: false,
        }),
      );
    } else {
      const course = courses.find((c) => c.id === dialogCourseId);
      dispatch(
        submitRequest({
          type: "course-drop",
          title: `Drop ${course?.name ?? "course"}`,
          description: "Student requested to drop course",
          createdBy: user!.id,
          createdForRole: "admin",
          approvers: ["admin"],
          approvals: { admin: "pending" },
          payload: { courseId: dialogCourseId, studentId: user.id },
          remarks,
        }),
      );
      dispatch(
        addNotification({
          title: "New drop request",
          description: `${user.name} requested to drop ${course?.name ?? "a course"}.`,
          recipientRole: "admin",
          link: "/admin/requests",
        }),
      );
    }
    setRemarks("");
    setDialogCourseId(null);
    setDialogMode(null);
  };

  const dialogCourse = courses.find((course) => course.id === dialogCourseId);
  const reviewsCourse = courses.find((course) => course.id === reviewsDialog);
  const reviewsForDialog = feedback.filter((item) => item.courseId === reviewsDialog);
  const myReviewForRating = ratingDialog && user ? feedback.find((item) => item.courseId === ratingDialog && item.studentId === user.id) : undefined;

  const getAverageRating = (courseId: string) => {
    const items = feedback.filter((item) => item.courseId === courseId);
    if (!items.length) return 0;
    const sum = items.reduce((total, item) => total + item.rating, 0);
    return Math.round((sum / items.length) * 10) / 10;
  };

  const openRating = (courseId: string) => {
    setRatingDialog(courseId);
    if (user) {
      const mine = feedback.find((item) => item.courseId === courseId && item.studentId === user.id);
      if (mine) {
        setRatingValue(mine.rating);
        setRatingText(mine.comment ?? "");
      } else {
        setRatingValue(5);
        setRatingText("");
      }
    }
  };

  return (
    <Box>
      <PageHeader title="My Courses" subtitle="Manage core and optional enrollments" />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h3" fontSize={20} mb={2}>
                Enrolled Courses
              </Typography>
              <Stack spacing={2}>
                {myEnrollments.map((enrollment) => {
                  const course = courses.find((item) => item.id === enrollment.courseId);
                  const teacher = teachers.find((t) => t.id === course?.teacherId);
                  return (
                    <Box key={enrollment.id} p={2} borderRadius={1.5} bgcolor="background.default">
                      <Typography fontWeight={600}>{course?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course?.code} · {teacher?.name ?? "Faculty"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course?.scheduleSummary}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                        <Rating value={getAverageRating(enrollment.courseId)} precision={0.5} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {getAverageRating(enrollment.courseId) || "No ratings"}
                        </Typography>
                      </Stack>
                      {!enrollment.isCore && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => {
                            setDialogCourseId(enrollment.courseId);
                            setDialogMode("drop");
                          }}
                        >
                          Request Drop
                        </Button>
                      )}
                      <Stack direction="row" spacing={1} mt={1}>
                        <Button variant="text" size="small" onClick={() => openRating(enrollment.courseId)}>
                          Rate / Feedback
                        </Button>
                        <Button variant="text" size="small" onClick={() => setReviewsDialog(enrollment.courseId)}>
                          View Reviews
                        </Button>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h3" fontSize={20} mb={2}>
                Optional Catalog
              </Typography>
              <Stack spacing={2}>
                {optionalCourses.map((course) => {
                  const teacher = teachers.find((t) => t.id === course.teacherId);
                  const enrolled = enrolledCourseIds.has(course.id);
                  return (
                    <Box key={course.id} p={2} borderRadius={1.5} border={1} borderColor="divider">
                      <Typography fontWeight={600}>{course.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.code} · {course.credits} credits
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {teacher?.name ?? "Faculty"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.scheduleSummary}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                        <Rating value={getAverageRating(course.id)} precision={0.5} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {getAverageRating(course.id) || "No ratings"}
                        </Typography>
                      </Stack>
                      <Button
                        variant={enrolled ? "outlined" : "contained"}
                        color={enrolled ? "secondary" : "primary"}
                        sx={{ mt: 1 }}
                        onClick={() => {
                          setDialogCourseId(course.id);
                          setDialogMode(enrolled ? "drop" : "enroll");
                        }}
                      >
                        {enrolled ? "Request Drop" : "Enroll"}
                      </Button>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Button variant="text" size="small" onClick={() => openRating(course.id)}>
                          Rate / Feedback
                        </Button>
                        <Button variant="text" size="small" onClick={() => setReviewsDialog(course.id)}>
                          View Reviews
                        </Button>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={Boolean(dialogMode)}
        onClose={() => {
          setDialogMode(null);
          setDialogCourseId(null);
          setRemarks("");
        }}
      >
        <DialogTitle>{dialogMode === "enroll" ? "Enroll in Course" : "Request Course Drop"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogMode === "enroll"
              ? `Confirm enrollment in ${dialogCourse?.name}?`
              : `Submit a drop request for ${dialogCourse?.name}. Admin approval required.`}
          </DialogContentText>
          {dialogMode === "drop" && (
            <TextField
              label="Remarks"
              multiline
              minRows={3}
              fullWidth
              sx={{ mt: 2 }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogMode(null)}>Cancel</Button>
          <Button onClick={handleAction} color={dialogMode === "enroll" ? "primary" : "error"}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
            open={Boolean(ratingDialog)}
            onClose={() => {
              setRatingDialog(null);
              setRatingValue(5);
              setRatingText("");
            }}
            fullWidth
            maxWidth="sm"
          >
        <DialogTitle>{myReviewForRating ? "Edit your review" : "Rate Course"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography variant="body2">Provide a rating. Visible to teacher and admin.</Typography>
            <Rating value={ratingValue} onChange={(_, value) => setRatingValue(value)} />
            <TextField
              label="Feedback (optional)"
              multiline
              minRows={3}
              value={ratingText}
              onChange={(e) => setRatingText(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!ratingDialog || !ratingValue || !user) return;
              if (myReviewForRating) {
                dispatch(updateFeedback({ id: myReviewForRating.id, rating: ratingValue as 1 | 2 | 3 | 4 | 5, comment: ratingText }));
              } else {
                dispatch(
                  submitFeedback({
                    courseId: ratingDialog,
                    studentId: user.id,
                    rating: ratingValue as 1 | 2 | 3 | 4 | 5,
                    comment: ratingText,
                  }),
                );
              }
              setRatingDialog(null);
              setRatingValue(5);
              setRatingText("");
            }}
          >
            {myReviewForRating ? "Save changes" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(reviewsDialog)} onClose={() => setReviewsDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>Reviews for {reviewsCourse?.name ?? "course"}</DialogTitle>
        <DialogContent>
          <List>
            {reviewsForDialog.length === 0 && <ListItem><ListItemText primary="No reviews yet." /></ListItem>}
            {reviewsForDialog.map((item) => {
              const reviewer = users.find((u) => u.id === item.studentId);
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
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewsDialog(null)}>Close</Button>
          {ratingDialog && <Button onClick={() => openRating(ratingDialog)}>Edit my review</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentCourses;
