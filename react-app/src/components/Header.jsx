import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "react-query";
import { useApp } from "../AppProvider";

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

async function fetchNotifications() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/notifications`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
}

export default function Header() {
    const { auth, showForm, setShowForm, mode, setMode, setShowDrawer } = useApp();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Fetch notifications and calculate unread count
    const { data: notifications = [] } = useQuery(
        "notifications",
        fetchNotifications,
        {
            enabled: !!auth, // Only fetch if user is authenticated
            refetchInterval: 30000, // Refetch every 30 seconds
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
                                sx={{
                                    "& .MuiBadge-badge": {
                                        right: -3,
                                        top: 3,
                                    },
                                }}
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    )}

                    {mode === "dark" ? (
                        <IconButton
                            color="inherit"
                            onClick={() => setMode("light")}
                        >
                            <LightModeIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => setMode("dark")}
                        >
                            <DarkModeIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
