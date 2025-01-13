import { useState } from "react";
import { useQuery } from "react-query";
import {
    Container,
    Box,
    TextField,
    CircularProgress,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
} from "@mui/material";
import { Link } from "react-router";
import { fetchWithAuth } from "../utils/api";

export default function Search() {
    const [query, setQuery] = useState("");

    const { data: users, isLoading } = useQuery(
        ["search", query],
        () => fetchWithAuth(`/search?q=${encodeURIComponent(query)}`),
        {
            enabled: query.length > 0,
        }
    );

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    label="Search users"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </Box>

            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {users?.length === 0 && (
                <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center", mt: 4 }}>
                    No users found
                </Typography>
            )}

            <List>
                {users?.map((user) => (
                    <ListItem
                        key={user.id}
                        component={Link}
                        to={`/users/${user.id}`}
                        sx={{
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": {
                                bgcolor: "action.hover",
                            },
                        }}>
                        <ListItemAvatar>
                            <Avatar>{user.name[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.name}
                            secondary={`@${user.username}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}
