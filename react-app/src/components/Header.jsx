import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router";

import { useApp } from "../AppProvider";
import { useQuery } from "react-query";

async function fetchNotis() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/notis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export default function Header() {
  const { showForm, setShowForm, mode, setMode, setShowDrawer, auth } =
    useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoading, isError, data } = useQuery(["notis", auth], fetchNotis);

  function notiCount() {
    if (!auth) return 0;
    if (isLoading || isError) return 0;

    console.log(`data: ${data}`);
    return data.filter((noti) => !noti.read).length;
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {pathname === "/" ? (
            <IconButton color="inherit" onClick={() => setShowDrawer(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography>App</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            border: 1,
            px: 6,
            my: 2,
            borderRadius: 8,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.5,
            },
          }}
        >
          <IconButton color="inherit" sx={{ opacity: 0.5 }}>
            <SearchIcon />
          </IconButton>
          <Typography sx={{ px: 1, opacity: 0.5 }}>
            Search for blogs or users
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {auth && (
            <IconButton color="inherit" onClick={() => setShowForm(!showForm)}>
              <AddIcon />
            </IconButton>
          )}

          {auth && (
            <IconButton color="inherit" onClick={() => navigate("/notis")}>
              <Badge color="error" badgeContent={notiCount()}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}

          {mode == "dark" ? (
            <IconButton
              color="inherit"
              onClick={() => {
                setMode("light");
              }}
            >
              <LightModeIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              onClick={() => {
                setMode("dark");
              }}
            >
              <DarkModeIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
