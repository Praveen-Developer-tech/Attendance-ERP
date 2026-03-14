import { AppBar, Avatar, Badge, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, Divider } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { useState } from "react";
import type { Role, User } from "../../types";
import RoleBadge from "../common/RoleBadge";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { markAllReadForUser } from "../../features/notifications/notificationsSlice";

interface TopBarProps {
  onMenuToggle: () => void;
  user?: User;
}

const TopBar = ({ onMenuToggle, user }: TopBarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchor);
  const dispatch = useAppDispatch();
  const initials = user?.name
    ?.split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const role = user?.role ?? ("student" as Role);
  const notifications = useAppSelector((state) => state.notifications.items);
  const filteredNotifications = notifications.filter(
    (item) => item.recipientUserId === user?.id || item.recipientRole === role,
  );
  const unreadCount = filteredNotifications.filter((item) => !item.read).length;
  const sortedNotifications = filteredNotifications.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 4, lg: 6 }, gap: 2 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{
            backgroundColor: "primary.main",
            color: "#fff",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Stack spacing={0.2} flexGrow={1} ml={{ xs: 0, md: 1 }}>
          <Typography variant="subtitle1" color="text.secondary" fontWeight={500} letterSpacing={1} textTransform="uppercase">
            Dayanand Sagar Academy
          </Typography>
          <Typography variant="h2" fontSize={22} color="primary.main">
            Unified Attendance ERP
          </Typography>
        </Stack>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            color="inherit"
            onClick={(event) => {
              setNotifAnchor(event.currentTarget);
              if (!user) return;
              dispatch(markAllReadForUser({ userId: user.id, role }));
            }}
          >
            <Badge color="error" badgeContent={unreadCount} invisible={unreadCount === 0}>
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
          <RoleBadge role={role} />
          <Box
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              backgroundColor: "background.paper",
            }}
          >
            <Avatar sx={{ width: 40, height: 40 }}>{initials ?? "NH"}</Avatar>
            <Stack spacing={0}>
              <Typography variant="subtitle1" fontSize={14} fontWeight={600} color="text.primary">
                {user?.name ?? "Guest"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tap for menu
              </Typography>
            </Stack>
            <ExpandMoreRoundedIcon fontSize="small" />
          </Box>
          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>{user?.email ?? "profile"}</MenuItem>
            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={() => window.dispatchEvent(new CustomEvent("nhu-logout"))}>Logout</MenuItem>
          </Menu>
          <Menu
            anchorEl={notifAnchor}
            open={notifOpen}
            onClose={() => setNotifAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { sx: { width: 320, maxHeight: 360 } } }}
          >
            <Stack px={2} py={1} spacing={1.5}>
              <Typography variant="subtitle1" fontWeight={700}>
                Notifications
              </Typography>
              <Divider />
              {sortedNotifications.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No notifications yet.
                </Typography>
              )}
              {sortedNotifications.slice(0, 6).map((item) => (
                <Box key={item.id}>
                  <Typography fontWeight={600} variant="body2">
                    {item.title}
                  </Typography>
                  {item.description && (
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Stack>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
