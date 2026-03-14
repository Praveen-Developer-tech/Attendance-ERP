import { Box, Chip, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  helperText?: string;
  changeText?: string;
  color?: "primary" | "secondary" | "success" | "error";
}

const gradients: Record<NonNullable<StatCardProps["color"]>, string> = {
  primary: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(59,130,246,0.25))",
  secondary: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,191,36,0.3))",
  success: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.3))",
  error: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(248,113,113,0.3))",
};

const StatCard = ({ title, value, helperText, changeText, icon, color = "primary" }: StatCardProps) => (
  <Box
    p={3}
    borderRadius={2}
    display="flex"
    flexDirection="column"
    gap={2}
    minHeight={160}
    border="1px solid rgba(15,23,42,0.08)"
    sx={{ backgroundImage: gradients[color] }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="subtitle1" color="text.secondary" textTransform="uppercase" letterSpacing={1} fontSize={12}>
          {title}
        </Typography>
        <Typography variant="h3" mt={1} fontWeight={700} color="text.primary">
          {value}
        </Typography>
      </Box>
      {icon && (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            backgroundColor: `${color}.main`,
            color: "#fff",
          }}
        >
          {icon}
        </Box>
      )}
    </Stack>
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      {changeText && <Chip size="small" label={changeText} color={color} />}
      {helperText && (
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      )}
    </Stack>
  </Box>
);

export default StatCard;
