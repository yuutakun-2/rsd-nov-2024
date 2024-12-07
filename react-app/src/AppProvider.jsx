import { createContext, useContext, useState, useMemo } from "react";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import AppRouter from "./AppRouter";

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export default function AppProvider() {
  const [showForm, setShowForm] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [mode, setMode] = useState("dark");
  const [auth, setAuth] = useState(false);

  const [posts, setPosts] = useState([
    { id: 3, content: "Some content", user: "Alice" },
    { id: 2, content: "More content", user: "Alice" },
    { id: 1, content: "Another content", user: "Bob" },
  ]);

  const add = useState((content) => {
    const id = posts[0].id + 1;
    setPosts([{ id, content, user: "Alice" }, ...posts]);
  });

  const remove = useState((id) => {
    setPosts(posts.filter((post) => post.id != id));
  });

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
        posts,
        setPosts,
        add,
        remove,
      }}
    >
      <ThemeProvider theme={theme}>
        <AppRouter />
        <CssBaseline />
      </ThemeProvider>
    </AppContext.Provider>
  );
}
