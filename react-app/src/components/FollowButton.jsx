import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { useApp } from "../AppProvider";

async function followUser(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/users/${id}/follow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to follow user.");
  return res.json();
}

async function unfollowUser(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/users/${id}/unfollow`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to unfollow user.");
  return res.json();
}

export default function FollowButton({ user }) {
  const queryClient = useQueryClient();
  const { auth } = useApp();
  const isFollowed = user.followers?.some((f) => f.followerId === auth?.id);

  if (auth?.id === user.id) {
    return;
  }

  const follow = useMutation(followUser, {
    onSuccess: () => {
      // queryClient.invalidateQueries(["user", user.id]);
      queryClient.invalidateQueries("user");
    },
  });

  const unfollow = useMutation(unfollowUser, {
    onSuccess: () => {
      // queryClient.invalidateQueries(["user", user.id]);
      queryClient.invalidateQueries("user");
    },
  });

  const handleClick = () => {
    if (isFollowed) {
      unfollow.mutate(user.id);
    } else if (!isFollowed) {
      follow.mutate(user.id);
    }
  };

  return (
    <Button
      variant={isFollowed ? "outlined" : "contained"}
      onClick={handleClick}
      sx={{ alignSelf: "center" }}
    >
      {isFollowed ? "Unfollow" : "Follow"}
    </Button>
  );
}
