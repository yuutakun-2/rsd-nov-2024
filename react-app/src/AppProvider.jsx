import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClientProvider, QueryClient, useQueryClient } from "react-query";

import AppRouter from "./AppRouter";

import { wsService } from "./services/websocket";
import { fetchWithAuth } from "./utils/api";

const AppContext = createContext();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60, // 1 minute
        },
    },
});

const API = import.meta.env.VITE_API || "http://localhost:8080";

export function useApp() {
	return useContext(AppContext);
}

export default function AppProvider() {
	const [showForm, setShowForm] = useState(false);
	const [showDrawer, setShowDrawer] = useState(false);
	const [mode, setMode] = useState("dark");
	const [auth, setAuth] = useState(null);

    // Handle WebSocket notifications
    useEffect(() => {
        const token = localStorage.getItem("token");
        
        // Only connect if we have both auth and token
        if (auth && token) {
            wsService.connect(token);
            
            // Add notification listener
            const unsubscribe = wsService.addListener((notification) => {
                // Update React Query cache
                queryClient.setQueryData("notifications", (old = []) => {
                    // Check if notification already exists
                    const exists = old.find(n => n.id === notification.id);
                    if (exists) return old;
                    
                    // Add new notification at the beginning
                    return [notification, ...old];
                });
            });

            return () => {
                unsubscribe();
                wsService.disconnect();
            };
        } else {
            wsService.disconnect();
        }
    }, [auth]);

    // Verify user session on app load
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                handleLogout();
                return;
            }

            try {
                const user = await fetchWithAuth("/verify");
                handleLogin(user, token);
            } catch (error) {
                console.error('Auth verification failed:', error);
                handleLogout();
            }
        };

        verifyUser();
    }, []); // Run once on app load

    const handleLogin = (user, token) => {
        // Set token first
        localStorage.setItem("token", token);
        // Then update auth state
        setAuth(user);
        // Invalidate queries to refetch fresh data
        queryClient.invalidateQueries();
    };

    const handleLogout = () => {
        // Disconnect WebSocket first
        wsService.disconnect();
        // Clear token
        localStorage.removeItem("token");
        // Clear auth state
        setAuth(null);
        // Clear all queries from the cache
        queryClient.clear();
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            await fetchWithAuth(`/notifications/${notificationId}/read`, {
                method: "POST"
            });
            
            // Update React Query cache
            queryClient.setQueryData("notifications", (old = []) => 
                old.map(n => 
                    n.id === notificationId 
                        ? { ...n, read: true }
                        : n
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

	const theme = useMemo(() => {
		return createTheme({
			palette: {
				mode,
			}
		});
	}, [mode]);

	const value = {
		auth,
		showForm,
		setShowForm,
		mode,
		setMode,
		showDrawer,
		setShowDrawer,
        login: handleLogin,
        logout: handleLogout,
        markNotificationAsRead,
	};

	return (
		<AppContext.Provider value={value}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<AppRouter />
				</ThemeProvider>
			</QueryClientProvider>
		</AppContext.Provider>
	);
}
