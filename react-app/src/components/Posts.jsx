import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { useApp } from "../AppProvider";
import Item from "./Item";
import { fetchWithAuth } from "../utils/api";

const API = "http://localhost:8080";

export default function Posts({ type = "all" }) {
    const { auth } = useApp();

    const {
        data: posts = [],
        isLoading,
        error,
    } = useQuery(
        ["posts", type],
        () => fetchWithAuth(`/posts${type === "following" ? "/following" : ""}`),
        {
            enabled: type !== "following" || !!auth,
        }
    );

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
                Error loading posts: {error.message}
            </Typography>
        );
    }

    if (!posts?.length) {
        return (
            <Typography 
                color="text.secondary" 
                textAlign="center" 
                sx={{ mt: 4 }}
            >
                {type === "following" 
                    ? "No posts from people you follow" 
                    : "No posts yet"}
            </Typography>
        );
    }

    return (
        <Box>
            {posts.map((post) => (
                <Item key={post.id} post={post} />
            ))}
        </Box>
    );
}
