import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SidebarNav, { EXPANDED_WIDTH } from "../components/navigation/SidebarNav";
import TopBar from "../components/navigation/TopBar";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../features/auth/authSlice";

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const sidebarWidth = useMemo(() => (desktopOpen ? EXPANDED_WIDTH : 0), [desktopOpen]);

  const handleMenuToggle = () => {
    if (isDesktop) {
      setDesktopOpen((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!isDesktop) {
      setDesktopOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => {
      dispatch(logout());
      navigate("/login");
    };
    window.addEventListener("nhu-logout", handler);
    return () => window.removeEventListener("nhu-logout", handler);
  }, [dispatch, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", backgroundColor: "background.default", minHeight: "100vh" }}>
      <TopBar onMenuToggle={handleMenuToggle} user={user} />
      <SidebarNav role={user.role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} desktopOpen={desktopOpen} sidebarWidth={sidebarWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4, lg: 6 },
          pb: { xs: 4, md: 6 },
          pt: { xs: 10, md: 12 },
          width: "100%",
          transition: (theme) => theme.transitions.create(["padding"], { duration: theme.transitions.duration.shorter }),
        }}
      >
        <Box sx={{ maxWidth: "1400px", mx: "auto", width: "100%" }}>
          <Outlet key={`${location.pathname}${location.search}`} />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
