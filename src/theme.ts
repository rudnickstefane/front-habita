import { createTheme } from "@mui/material/styles";

export const habitaTheme = createTheme({
  palette: {
    primary: {
      main: "#1f6f5b",
      dark: "#155445",
      contrastText: "#fff",
    },
    secondary: {
      main: "#c46a3a",
    },
    background: {
      default: "#f6f1ea",
      paper: "#fffaf4",
    },
    text: {
      primary: "#16332b",
      secondary: "#5b6b64",
    },
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});
