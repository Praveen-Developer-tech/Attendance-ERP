import { Stack } from "@mui/material";
import type { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
}

const FilterBar = ({ children }: FilterBarProps) => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
    mb={2}
    alignItems="stretch"
    sx={{
      width: "100%",
      "& > *": {
        width: { xs: "100%", md: "auto" },
      },
    }}
  >
    {children}
  </Stack>
);

export default FilterBar;
