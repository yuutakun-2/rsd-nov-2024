import { Box, Card, IconButton, Typography, Avatar } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useApp } from "../AppProvider";
import { blue } from "@mui/material/colors";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";

async function deleteComment(commentId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete comment");

  return res.json();
}

export default function Comment({ comment }) {
  const { auth } = useApp();
  const queryClient = useQueryClient();

  const remove = useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["post", Number(comment.postId)]);
    },
  });

  return (
    <Box>
      <Card
        sx={{
          mb: 2,
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
            <Avatar sx={{ width: 32, height: 32, background: blue[500] }} />
            <Typography sx={{ fontWeight: "bold" }}>
              {comment.user.name}
            </Typography>
          </Box>
          {/* Test this later */}
          {auth && auth.id === comment.userId && (
            <IconButton onClick={() => remove.mutate(comment.id)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <Typography>{comment.content}</Typography>
      </Card>
    </Box>
  );
}
