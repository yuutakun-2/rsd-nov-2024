import { useLocation, useNavigate } from "react-router";
import { useQuery } from "react-query";
import { useApp } from "../AppProvider";
import { fetchWithAuth } from "../utils/api";

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Badge,
} from "@mui/material";

import {
    Menu as MenuIcon,
    ArrowBack as BackIcon,
    Add as AddIcon,
    Search as SearchIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Notifications as NotificationsIcon,
} from "@mui/icons-material";

const API = "http://localhost:8080";

export default function Header() {
    const { 
        auth, 
        showForm, 
        setShowForm, 
        mode, 
        setMode, 
        setShowDrawer,
    } = useApp();

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { data: notifications = [] } = useQuery(
        "notifications",
        () => fetchWithAuth("/notifications"),
        {
            enabled: !!auth,
            staleTime: 1000 * 60, // 1 minute
        }
    );

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {pathname === "/" ? (
                        <IconButton
                            color="inherit"
                            onClick={() => setShowDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate(-1)}
                        >
                            <BackIcon />
                        </IconButton>
                    )}
                    <Typography>App</Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <AddIcon />
                        </IconButton>
                    )}

                    <IconButton
                        color="inherit"
                        onClick={() => navigate("/search")}
                    >
                        <SearchIcon />
                    </IconButton>

                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate("/notifications")}
                        >
                            <Badge 
                                badgeContent={unreadCount} 
                                color="error"
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    )}

                    <IconButton
                        color="inherit"
                        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                    >
                        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
