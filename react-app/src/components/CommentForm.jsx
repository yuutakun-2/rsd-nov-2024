import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { useApp } from "../AppProvider";
import { fetchWithAuth } from "../utils/api";

const API = "http://localhost:8080";

export default function CommentForm({ postId }) {
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();
    const { auth } = useApp();

    const mutation = useMutation(
        async () => {
            return fetchWithAuth(`/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: comment }),
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["post", postId.toString()]);
                setComment("");
            },
        }
    );

    const handleSubmit = e => {
        e.preventDefault();
        if (!comment.trim()) return;
        mutation.mutate();
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ mt: 2 }}
        >
            <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={mutation.isLoading}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={!comment.trim() || mutation.isLoading}
                >
                    {mutation.isLoading ? "Commenting..." : "Comment"}
                </Button>
            </Box>
        </Box>
    );
}
