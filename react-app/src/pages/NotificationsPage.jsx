import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Container,
    Button,
    CircularProgress,
} from "@mui/material";
import { formatDistance } from "date-fns";
import { blue } from "@mui/material/colors";
import { fetchWithAuth } from "../utils/api";
import { useApp } from "../AppProvider";

export default function NotificationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { auth } = useApp();

    const { data: notifications = [], isLoading } = useQuery(
        "notifications",
        () => fetchWithAuth("/notifications"),
        {
            enabled: !!auth,
            retry: false, // Don't retry on failure
            onError: (error) => {
                if (error.message === "Unauthorized") {
                    navigate("/login");
                }
            }
        }
    );

    const markAsReadMutation = useMutation(
        (id) => fetchWithAuth(`/notifications/${id}/read`, { method: "POST" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("notifications");
            }
        }
    );

    const markAllAsReadMutation = useMutation(
        () => fetchWithAuth("/notifications/read", { method: "PUT" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("notifications");
            }
        }
    );

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markAsReadMutation.mutate(notification.id);
        }
        navigate(`/posts/${notification.post.id}`);
    };

    // Don't show loading state if not authenticated
    if (!auth) {
        return null;
    }

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Notifications
                </Typography>

                {unreadCount > 0 && (
                    <Button
                        variant="outlined"
                        onClick={() => markAllAsReadMutation.mutate()}
                        disabled={markAllAsReadMutation.isLoading}
                        sx={{ mb: 2 }}
                    >
                        {markAllAsReadMutation.isLoading ? "Marking..." : "Mark All as Read"}
                    </Button>
                )}

                {notifications.length === 0 ? (
                    <Typography
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: 4 }}>
                        No notifications
                    </Typography>
                ) : (
                    <List>
                        {notifications.map((notification) => (
                            <ListItem
                                key={notification.id}
                                button
                                onClick={() => handleNotificationClick(notification)}
                                sx={{
                                    bgcolor: notification.read
                                        ? "transparent"
                                        : "action.hover",
                                }}>
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            bgcolor: blue[500],
                                        }}>
                                        {notification.actor.name[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            <Typography
                                                component="span"
                                                sx={{ fontWeight: "bold" }}>
                                                {notification.actor.name}
                                            </Typography>
                                            <Typography component="span">
                                                {notification.type === "LIKE"
                                                    ? "liked your post"
                                                    : notification.type === "COMMENT"
                                                        ? "commented on your post"
                                                        : notification.type === "FOLLOW"
                                                            ? "started following you"
                                                            : ""}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={formatDistance(
                                        new Date(notification.created),
                                        new Date(),
                                        { addSuffix: true }
                                    )}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Container>
    );
}
