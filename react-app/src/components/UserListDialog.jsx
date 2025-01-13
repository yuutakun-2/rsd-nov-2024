import {
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Box,
    CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router";
import { useQuery } from "react-query";
import { fetchWithAuth } from "../utils/api";

const API = "http://localhost:8080";

const getEndpoint = (id, type) => {
    if (type === 'followers' || type === 'following') {
        return `/users/${id}/${type}`;
    } else if (type === 'likes') {
        return `/posts/${id}/likes`;
    }
    throw new Error('Invalid type');
};

export default function UserListDialog({ open, onClose, userId, type, title }) {
    const navigate = useNavigate();

    const { data: users = [], isLoading, error } = useQuery(
        ["users", userId, type],
        () => fetchWithAuth(getEndpoint(userId, type)),
        {
            enabled: open
        }
    );

    const handleUserClick = (userId) => {
        navigate(`/users/${userId}`);
        onClose();
    };

    return (
        <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ p: 3 }}>
                    <ListItemText primary={error.message} sx={{ color: "error.main" }} />
                </Box>
            ) : !users.length ? (
                <Box sx={{ p: 3 }}>
                    <ListItemText primary="No users found" />
                </Box>
            ) : (
                <List sx={{ pt: 0 }}>
                    {users.map((user) => (
                        <ListItem disablePadding key={user.id}>
                            <ListItemButton onClick={() => handleUserClick(user.id)}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[500] }}>
                                        {user.name[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={user.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Dialog>
    );
}
