import { Container, Avatar, Box, Typography, Button } from "@mui/material";

import Item from "../components/Item";
import FollowButton from "../components/FollowButton";

import { useQuery } from "react-query";
import { useParams } from "react-router";
import { useApp } from "../AppProvider";

async function fetchUser(id) {
  const res = await fetch(`${import.meta.env.VITE_API}/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user.");

  return res.json();
}

export default function Profile() {
  const { id } = useParams();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery(["user", Number(id)], () => fetchUser(id));

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 4,
        }}
      >
        <Avatar sx={{ width: 120, height: 120, my: 2 }}>
          {user.name.split(" ")[0]}
        </Avatar>
        <Typography variant="h3">{user.name}</Typography>
        <Typography variant="h4">@{user.username}</Typography>
      </Container>
      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h5">
          Followers: {user.followers?.length || 0}
        </Typography>
        <Typography variant="h5">
          Following: {user.follows?.length || 0}
        </Typography>
      </Container>
      <FollowButton user={user} />
      <Box>
        {user.posts?.map((post) => (
          <Item key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
}
