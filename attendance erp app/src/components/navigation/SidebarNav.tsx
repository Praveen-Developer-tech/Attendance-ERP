import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import type { Role } from "../../types";
import { navConfig } from "../../routes/navConfig";

interface SidebarNavProps {
  role: Role;
  mobileOpen: boolean;
  desktopOpen: boolean;
  onClose: () => void;
  sidebarWidth: number;
}

const EXPANDED_WIDTH = 280;
const TOPBAR_HEIGHT = 60;

const SidebarNav = ({ role, mobileOpen, onClose, desktopOpen, sidebarWidth }: SidebarNavProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const items = navConfig[role];

  const renderContent = () => (
    <Stack height="100%" spacing={3} px={2} py={3} sx={{ color: "#e2e8f0" }}>
      <Box px={1}>
        <Typography variant="subtitle1" fontSize={12} letterSpacing={2} textTransform="uppercase" color="primary.light" sx={{ opacity: 0.7 }}>
          Navigate
        </Typography>
        <Typography variant="h2" fontSize={18} fontWeight={600} mt={0.5}>
          {role.toUpperCase()}
        </Typography>
      </Box>
      <List
        disablePadding
        sx={{
          flexGrow: 1,
          display: "grid",
          gap: 1,
          gridAutoRows: "minmax(56px, auto)",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(auto-fit, minmax(120px, 1fr))" },
        }}
      >
        {items.map((item) => {
          const selected = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  onClose();
                }
              }}
              sx={{
                borderRadius: 2,
                minHeight: 56,
                gap: 1.5,
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: selected ? "rgba(255,255,255,0.12)" : "transparent",
                transition: (theme) => theme.transitions.create(["background-color", "transform"], { duration: theme.transitions.duration.shortest }),
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.18)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box px={1}>
        <Typography variant="caption" color="rgba(255,255,255,0.6)">
          NHU Attendance Platform
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={isMobile && mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: EXPANDED_WIDTH,
            boxSizing: "border-box",
            top: `${TOPBAR_HEIGHT}px`,
            height: `calc(100% - ${TOPBAR_HEIGHT}px)` ,
          },
        }}
      >
        {renderContent()}
      </Drawer>
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "flex" },
          width: desktopOpen ? sidebarWidth : 0,
          transition: (theme) => theme.transitions.create("width", { duration: theme.transitions.duration.shorter }),
          overflow: "hidden",
          mt: `${TOPBAR_HEIGHT}px`,
          height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          position: "sticky",
          top: `${TOPBAR_HEIGHT}px`,
        }}
      >
        {desktopOpen && (
          <Box width="100%" height="100%" sx={{ backgroundColor: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            {renderContent()}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SidebarNav;
export { EXPANDED_WIDTH };
