import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Item from "./Item";

const API = "http://localhost:8080";

const fetchPosts = async (type = "latest") => {
    const endpoint = type === "following" ? "/posts/following" : "/posts";
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const res = await fetch(`${API}${endpoint}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
};

const deletePost = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/posts/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to delete post");
    return res.json();
};

export default function Posts({ type = "latest" }) {
    const queryClient = useQueryClient();
    const queryKey = ["posts", type];

    const { data: posts, error, isLoading } = useQuery(
        queryKey,
        () => fetchPosts(type),
        {
            enabled: type !== "following" || !!localStorage.getItem("token")
        }
    );

    const { mutate: remove } = useMutation(deletePost, {
        onMutate: (id) => {
            queryClient.setQueryData(queryKey, (old) => {
                return old.filter((post) => post.id !== id);
            });
        },
    });

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" textAlign="center" sx={{ mt: 4 }}>
                {error.message}
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

    return posts.map((post) => (
        <Item key={post.id} post={post} remove={remove} />
    ));
}
