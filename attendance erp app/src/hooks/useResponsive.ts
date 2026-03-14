import { useMediaQuery, useTheme } from "@mui/material";

export const useResponsive = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  return { isXs, isSm, isMdUp };
};
