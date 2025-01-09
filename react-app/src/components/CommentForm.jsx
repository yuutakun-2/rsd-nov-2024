import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

async function postComment({ postId, content }) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${import.meta.env.VITE_API}/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!res.ok) throw new Error("Failed to post comment.");
  return res.json();
}

export default function CommentForm({ postId }) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { mutate: comment, isLoading } = useMutation(postComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
      setContent("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    comment({ postId, content });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        value={content}
        placeholder="Write a comment"
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!content.trim() || isLoading}
        >
          {isLoading ? "Commenting..." : "Comment"}
        </Button>
      </Box>
    </Box>
  );
}
