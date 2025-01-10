import { Container, Typography } from "@mui/material";
import Item from "../src/components/Item";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import Comment from "../src/components/Comment";
import { Box, CircularProgress } from "@mui/material";
import CommentForm from "../src/components/CommentForm";

async function fetchPost(id) {
  const res = await fetch(`${import.meta.env.VITE_API}/posts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export default function Post() {
  const { id } = useParams();
  const {
    data: post,
    isLoading,
    error,
  } = useQuery(["post", Number(id)], () => fetchPost(id));

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">
          Error loading post: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Item post={post} />
      {/* Comments */}
      {post.comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <CommentForm postId={Number(id)} />
    </Container>
  );
}
