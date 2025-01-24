import { createContext, useContext, useState, useMemo, useEffect } from "react";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import { QueryClientProvider, QueryClient } from "react-query";

import AppRouter from "./AppRouter";

import AppSocket from "./AppSocket";

const AppContext = createContext();
const queryClient = new QueryClient();

export function useApp() {
  return useContext(AppContext);
}

export default function AppProvider() {
  const [showForm, setShowForm] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [mode, setMode] = useState("dark");
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((user) => {
          setAuth(user);
        })
        .catch(() => {
          setAuth(false);
          localStorage.removeItem("token");
        });
    }
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
      },
    });
  }, [mode]);

  return (
    <AppContext.Provider
      value={{
        showDrawer,
        setShowDrawer,
        showForm,
        setShowForm,
        mode,
        setMode,
        auth,
        setAuth,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AppRouter />
          <AppSocket />
          <CssBaseline />
        </ThemeProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
