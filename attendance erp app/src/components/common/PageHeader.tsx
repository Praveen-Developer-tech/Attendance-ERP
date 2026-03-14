import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, md: 3 },
      borderRadius: 1.5,
      mb: 4,
      backgroundImage: "linear-gradient(120deg, rgba(37,99,235,0.14), rgba(14,165,233,0.18))",
      border: "1px solid rgba(37,99,235,0.2)",
    }}
  >
    <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between" spacing={2}>
      <Box>
        <Typography variant="h2" fontSize={{ xs: 24, md: 30 }} color="text.primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box>{actions}</Box>}
    </Stack>
  </Paper>
);

export default PageHeader;
