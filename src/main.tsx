import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import { habitaTheme } from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={habitaTheme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
