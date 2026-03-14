import { alpha, createTheme } from "@mui/material/styles";

const primaryMain = "#7c8cff";
const secondaryMain = "#f8a5c2";
const slateDark = "#1e1b4b";

const theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      light: "#a5b5ff",
      dark: "#5a6ee1",
    },
    secondary: {
      main: secondaryMain,
      light: "#fccbde",
      dark: "#ec729c",
    },
    success: {
      main: "#61c7a7",
    },
    warning: {
      main: "#f7c46c",
    },
    error: {
      main: "#ff6b6b",
    },
    background: {
      default: "#f4f6fb",
      paper: "#ffffff",
    },
    text: {
      primary: slateDark,
      secondary: "#6b6d8f",
    },
    divider: alpha(slateDark, 0.08),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "34px",
      fontWeight: 700,
    },
    h2: {
      fontSize: "28px",
      fontWeight: 700,
    },
    h3: {
      fontSize: "22px",
      fontWeight: 600,
      letterSpacing: 0.2,
    },
    body1: {
      fontSize: "15px",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "13px",
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: 0.3,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "linear-gradient(180deg, #fdfbff 0%, #f4f6fb 60%, #edf2fa 100%)",
          minHeight: "100vh",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 40,
          padding: "10px 22px",
          fontWeight: 600,
          boxShadow: "none",
          textTransform: "none",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
          borderRadius: "10px",
          backgroundColor: alpha("#ffffff", 0.8),
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid rgba(124,140,255,0.14)",
          boxShadow: "0 12px 35px rgba(31, 41, 55, 0.08)",
          backgroundImage: "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(249,250,255,0.9))",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: slateDark,
          color: "#e0e7ff",
          borderRight: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(124,140,255,0.15)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
