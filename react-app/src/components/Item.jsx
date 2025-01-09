import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";

import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { blue } from "@mui/material/colors";

import { useApp } from "../AppProvider";

import { useMutation, useQueryClient } from "react-query";

const likePost = async (postId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/posts/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to like post.");
  }
  return res.json();
};

const unlikePost = async (postId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/posts/${postId}/like`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to unlike post.");
  }
  return res.json();
};

export default function Item({ post, remove }) {
  const { auth } = useApp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const like = useMutation(likePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const unlike = useMutation(unlikePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  const isLiked = post.likes?.some((like) => like.userId === auth?.id);

  const handleLike = () => {
    if (!auth) return;
    if (isLiked) {
      unlike.mutate(post.id);
    } else {
      like.mutate(post.id);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, background: blue[500] }} />
            <Typography sx={{ fontWeight: "bold" }}>
              {post.user.name}
            </Typography>
          </Box>
          {auth && auth.id === post.userId && (
            <IconButton size="small" onClick={() => remove(post.id)}>
              <DeleteIcon sx={{ fontSize: 24 }} />
            </IconButton>
          )}
        </Box>

        <Typography>{post.content}</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <IconButton size="small" onClick={handleLike}>
              {isLiked ? (
                <FavoriteIcon sx={{ fontSize: 24, color: "red" }} />
              ) : (
                <FavoriteIcon sx={{ fontSize: 24 }} />
              )}
            </IconButton>
            <Typography variant="body2">{post.likes?.length || 0}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2">
              {post.comments?.length || 0}
            </Typography>
          </Stack>
          <IconButton size="small">
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
