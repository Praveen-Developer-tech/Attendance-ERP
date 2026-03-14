import { useState } from "react";
import { Box, Card, CardContent, Chip, Divider, Stack, Typography, Button, ToggleButtonGroup, ToggleButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks";
import type { RequestItem, RequestStatus } from "../../types";
import { updateRequestStatus } from "../../features/requests/requestsSlice";
import { addNotification } from "../../features/notifications/notificationsSlice";

const statusColor: Record<RequestStatus, "info" | "success" | "error" | "warning"> = {
  pending: "warning",
  approved: "success",
  declined: "error",
};

const RequestStatusPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const requests = useAppSelector((state) => state.requests.items);
  const users = useAppSelector((state) => state.admin.users);
  const filtered =
    user?.role === "admin"
      ? requests
      : requests.filter(
          (item) => item.createdBy === user?.id || (typeof item.createdBy === "string" && item.createdBy === user?.email),
        );
  const [statusFilter, setStatusFilter] = useState<"all" | RequestStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | RequestItem["type"]>("all");
  const [selected, setSelected] = useState<RequestItem | null>(null);
  const sorted = filtered
    .filter((item) => (statusFilter === "all" ? true : item.status === statusFilter))
    .filter((item) => (typeFilter === "all" ? true : item.type === typeFilter))
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const handleDecision = (status: RequestStatus) => {
    if (!selected) return;
    dispatch(updateRequestStatus({ id: selected.id, role: "admin", status }));
    const creator = users.find(
      (u) => u.id === selected.createdBy || u.email === (selected.payload as { email?: string } | undefined)?.email,
    );
    dispatch(
      addNotification({
        title: `Request ${status}`,
        description: `${selected.title} was ${status}.`,
        recipientUserId: creator?.id,
        recipientRole: creator?.role,
        link: creator ? `/${creator.role}/requests` : undefined,
      }),
    );
    setSelected(null);
  };

  return (
    <Box>
      <PageHeader title="My Requests" subtitle="Track approvals for your submitted actions" />
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
              <ToggleButtonGroup
                size="small"
                value={statusFilter}
                exclusive
                onChange={(_, value) => value && setStatusFilter(value)}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="pending">Pending</ToggleButton>
                <ToggleButton value="approved">Approved</ToggleButton>
                <ToggleButton value="declined">Declined</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup
                size="small"
                value={typeFilter}
                exclusive
                onChange={(_, value) => value && setTypeFilter(value)}
              >
                <ToggleButton value="all">All types</ToggleButton>
                <ToggleButton value="student-registration">Registration</ToggleButton>
                <ToggleButton value="attendance-update">Attendance</ToggleButton>
                <ToggleButton value="session-edit">Sessions</ToggleButton>
                <ToggleButton value="course-drop">Drop</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Divider />

            {sorted.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6">No matching requests</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try switching filters or submit a new request.
                </Typography>
              </Box>
            )}

            <Stack spacing={2} divider={<Divider flexItem />}>
              {sorted.map((item: RequestItem) => {
                const payloadEmail = (item.payload as { email?: string } | undefined)?.email;
                return (
                <Box
                  key={item.id}
                  display="flex"
                  flexDirection={{ xs: "column", md: "row" }}
                  gap={2}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                >
                  <Box>
                    <Typography fontWeight={700}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    {item.remarks && (
                      <Typography variant="body2" color="text.secondary">
                        Remarks: {item.remarks}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(item.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip label={item.type} size="small" />
                    <Chip label={item.status.toUpperCase()} color={statusColor[item.status]} />
                    {user?.role === "admin" && payloadEmail && (
                      <Chip label={payloadEmail} size="small" />
                    )}
                    {user?.role === "admin" && (
                      <Button size="small" variant="outlined" onClick={() => setSelected(item)}>
                        Review
                      </Button>
                    )}
                  </Stack>
                </Box>
              );
            })}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Review Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography fontWeight={700}>{selected?.title}</Typography>
            <Typography variant="body2" color="text.secondary">{selected?.description}</Typography>
            {selected?.remarks && (
              <Typography variant="body2" color="text.secondary">Remarks: {selected?.remarks}</Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Created: {selected ? new Date(selected.createdAt).toLocaleString() : ""}
            </Typography>
            {selected?.payload && (
              <Box p={1.5} border={1} borderColor="divider" borderRadius={1.5} bgcolor="background.default">
                <Typography variant="caption" color="text.secondary">
                  Payload
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {JSON.stringify(selected.payload, null, 2)}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          {user?.role === "admin" && selected?.status === "pending" && (
            <>
              <Button color="error" onClick={() => handleDecision("declined")}>Decline</Button>
              <Button variant="contained" onClick={() => handleDecision("approved")}>Approve</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestStatusPage;
