import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { useApp } from "../AppProvider";

const API = "http://localhost:8080";

const followUser = async (userId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/users/${userId}/follow`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to follow user");
    return res.json();
};

const unfollowUser = async (userId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/users/${userId}/follow`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to unfollow user");
    return res.json();
};

export default function FollowButton({ userId, isFollowing }) {
    const { auth } = useApp();
    const queryClient = useQueryClient();

    const { mutate: follow, isLoading: isFollowLoading } = useMutation(
        followUser,
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["user", userId.toString()]);
            },
        }
    );

    const { mutate: unfollow, isLoading: isUnfollowLoading } = useMutation(
        unfollowUser,
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["user", userId.toString()]);
            },
        }
    );

    if (!auth || auth.id === userId) return null;

    const isLoading = isFollowLoading || isUnfollowLoading;

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            onClick={() => {
                if (isFollowing) {
                    unfollow(userId);
                } else {
                    follow(userId);
                }
            }}
            disabled={isLoading}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
}
