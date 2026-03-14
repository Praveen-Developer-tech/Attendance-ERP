import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <Box component="main" minHeight="100vh" display="flex" alignItems="stretch">
    <Container maxWidth={false} disableGutters>
      <Outlet />
    </Container>
  </Box>
);

export default AuthLayout;
