import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { defaultRouteByRole } from "../../routes/navConfig";
import { demoCredentials } from "../../data/mockData";
import { submitRequest } from "../../features/requests/requestsSlice";
import type { Role } from "../../types";
import { addNotification } from "../../features/notifications/notificationsSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useAppSelector((state) => state.auth);
  const departments = useAppSelector((state) => state.admin.departments);
  const batches = useAppSelector((state) => state.admin.batches);
  const courses = useAppSelector((state) => state.admin.courses);
  const requests = useAppSelector((state) => state.requests.items);

  useEffect(() => {
    if (user) {
      navigate(defaultRouteByRole[user.role], { replace: true });
    }
  }, [user, navigate]);
  const [email, setEmail] = useState("student@nhu.edu");
  const [password, setPassword] = useState("student123");
  const [rememberMe, setRememberMe] = useState(true);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("welcome123");
  const [regRole, setRegRole] = useState<Role>("student");
  const [regDepartmentId, setRegDepartmentId] = useState("");
  const [regBatchId, setRegBatchId] = useState("");
  const [regCourseIds, setRegCourseIds] = useState<string[]>([]);
  const [regNotes, setRegNotes] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await dispatch(login({ email, password })).unwrap();
      if (!rememberMe) {
        window.localStorage.removeItem("nhu-auth-user");
      }
      navigate(defaultRouteByRole[user.role], { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const myRegistrationRequests = requests.filter(
    (item) => {
      const payloadEmail = (item.payload as { email?: string } | undefined)?.email;
      return (
        (item.type === "student-registration" || item.type === "teacher-registration") &&
        (payloadEmail === regEmail || payloadEmail === email)
      );
    },
  );

  const handleRegistration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!regName || !regEmail) return;
    if (regRole === "student" && regCourseIds.length === 0) return;
    dispatch(
      submitRequest({
        type: regRole === "student" ? "student-registration" : "teacher-registration",
        title: `${regRole === "student" ? "Student" : "Teacher"} registration – ${regName}`,
        description: "Requesting account access. Admin approval required.",
        createdBy: regEmail,
        createdForRole: "admin",
        approvers: ["admin"],
        approvals: { admin: "pending" },
        payload: {
          name: regName,
          email: regEmail,
          role: regRole,
          departmentId: regDepartmentId || undefined,
          batchId: regRole === "student" ? regBatchId || undefined : undefined,
          courseIds: regRole === "student" ? regCourseIds : undefined,
          password: regPassword,
          notes: regNotes,
        },
        remarks: regNotes,
      }),
    );
    dispatch(
      addNotification({
        title: "New registration request",
        description: `${regName} requested ${regRole} access`,
        recipientRole: "admin",
        link: "/admin/requests",
      }),
    );
    setRegNotes("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
        background: "radial-gradient(circle at 10% 20%, rgba(25,118,210,0.14), transparent 30%), radial-gradient(circle at 85% 10%, rgba(111,66,193,0.14), transparent 28%), #0c1022",
      }}
    >
      <Grid container spacing={3} sx={{ maxWidth: 1100 }} alignItems="stretch">
        <Grid size={{ xs: 12, md: 5 }} display={{ xs: "none", md: "flex" }}>
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              width: "100%",
              background: "linear-gradient(160deg, rgba(25,118,210,0.9), rgba(79,70,229,0.9))",
              color: "#fff",
              boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              justifyContent: "center",
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.85 }}>
              Attendance OS
            </Typography>
            <Typography variant="h3" fontWeight={800} lineHeight={1.1}>
              Simple, confident sign-in for NHU.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              One portal for students, teachers, and admins to track attendance, requests, and schedules effortlessly.
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <StatPill label="<2 min" caption="To get started" />
              <StatPill label="24/7" caption="Any device" />
              <StatPill label="99.9%" caption="Data integrity" />
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              borderRadius: 3,
              background: "#f8f9fb",
              boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 }, display: "grid", gap: 3 }}>
              <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                <Stack spacing={1} alignItems="center">
                  <Box
                    width={64}
                    height={64}
                    borderRadius={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="primary.light"
                    color="primary.contrastText"
                    boxShadow="0 8px 20px rgba(25,118,210,0.28)"
                  >
                    <SchoolRoundedIcon fontSize="large" />
                  </Box>
                  <Typography variant="h5" fontWeight={800} textAlign="center">
                    New Horizon University ERP
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Sign in with your NHU email to continue
                  </Typography>
                </Stack>

                <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  fullWidth
                />
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />}
                  label="Remember me"
                />

                {error && <Alert severity="error">{error}</Alert>}

                <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={status === "loading"} sx={{ borderRadius: 2 }}>
                  Login
                </LoadingButton>

                <Box>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Demo Credentials
                  </Typography>
                  {demoCredentials.map((credential) => (
                    <Stack
                      key={credential.email}
                      direction="row"
                      justifyContent="space-between"
                      sx={{ typography: "body2", py: 0.5 }}
                    >
                      <Typography color="text.secondary">{credential.role}</Typography>
                      <Typography>
                        {credential.email} / <strong>{credential.password}</strong>
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Stack>

              <Divider>
                <Typography variant="caption" textTransform="uppercase" letterSpacing={1} color="text.secondary">
                  Request Access
                </Typography>
              </Divider>

              <Stack spacing={2} component="form" onSubmit={handleRegistration}>
                <Typography variant="h6" fontWeight={700}>Need an account?</Typography>
                <TextField label="Full name" value={regName} onChange={(event) => setRegName(event.target.value)} required fullWidth />
                <TextField label="Email" type="email" value={regEmail} onChange={(event) => setRegEmail(event.target.value)} required fullWidth />
                <TextField
                  select
                  label="Role"
                  value={regRole}
                  onChange={(event) => setRegRole(event.target.value as Role)}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Department"
                  value={regDepartmentId}
                  onChange={(event) => setRegDepartmentId(event.target.value)}
                >
                  <MenuItem value="">Select department</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
                {regRole === "student" && (
                  <TextField
                    select
                    label="Batch"
                    value={regBatchId}
                    onChange={(event) => setRegBatchId(event.target.value)}
                  >
                    <MenuItem value="">Select batch</MenuItem>
                    {batches
                      .filter((batch) => !regDepartmentId || batch.departmentId === regDepartmentId)
                      .map((batch) => (
                        <MenuItem key={batch.id} value={batch.id}>
                          {batch.name}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
                {regRole === "student" && (
                  <TextField
                    select
                    SelectProps={{ multiple: true }}
                    label="Courses (choose at least one)"
                    value={regCourseIds}
                    onChange={(event) =>
                      setRegCourseIds(typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value)
                    }
                    helperText="Admin will finalize enrollment after approval"
                  >
                    {courses
                      .filter((course) => !regDepartmentId || course.departmentId === regDepartmentId)
                      .map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name} ({course.code})
                        </MenuItem>
                      ))}
                  </TextField>
                )}
                <TextField
                  label="Preferred password"
                  type="password"
                  value={regPassword}
                  onChange={(event) => setRegPassword(event.target.value)}
                  helperText="Used after approval. Admin can override."
                />
                <TextField
                  label="Notes (optional)"
                  multiline
                  minRows={2}
                  value={regNotes}
                  onChange={(event) => setRegNotes(event.target.value)}
                />
                <Button type="submit" variant="outlined" sx={{ borderRadius: 2 }}>
                  Submit for Approval
                </Button>

                {myRegistrationRequests.length > 0 && (
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Status for {regEmail || email}:
                    </Typography>
                    {myRegistrationRequests.map((req) => (
                      <Alert key={req.id} severity={req.status === "approved" ? "success" : req.status === "declined" ? "error" : "info"}>
                        {req.title} — {req.status.toUpperCase()}
                      </Alert>
                    ))}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const StatPill = ({ label, caption }: { label: string; caption: string }) => (
  <Stack
    sx={{
      px: 2,
      py: 1.2,
      borderRadius: 999,
      bgcolor: "rgba(255,255,255,0.14)",
      border: "1px solid rgba(255,255,255,0.2)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      backdropFilter: "blur(6px)",
    }}
    spacing={0.5}
  >
    <Typography variant="subtitle1" fontWeight={700} color="#fff" lineHeight={1}>
      {label}
    </Typography>
    <Typography variant="caption" color="rgba(255,255,255,0.85)">
      {caption}
    </Typography>
  </Stack>
);

export default LoginPage;
