import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { useApp } from "../AppProvider";
import { fetchWithAuth } from "../utils/api";

const API = "http://localhost:8080";

const followUser = async (userId, token) => {
    const res = await fetch(`${API}/users/${userId}/follow`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to follow user");
    return res.json();
};

const unfollowUser = async (userId, token) => {
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
    const queryClient = useQueryClient();
    const { auth } = useApp();

    const { mutate: follow, isLoading: isFollowLoading } = useMutation(
        () => fetchWithAuth(`/users/${userId}/follow`, { method: "POST" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["user", userId.toString()]);
            },
        }
    );

    const { mutate: unfollow, isLoading: isUnfollowLoading } = useMutation(
        () => fetchWithAuth(`/users/${userId}/follow`, { method: "DELETE" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["user", userId.toString()]);
            },
        }
    );

    const isLoading = isFollowLoading || isUnfollowLoading;

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            onClick={() => (isFollowing ? unfollow() : follow())}
            disabled={isLoading}
        >
            {isLoading
                ? isFollowing
                    ? "Unfollowing..."
                    : "Following..."
                : isFollowing
                ? "Unfollow"
                : "Follow"}
        </Button>
    );
}
