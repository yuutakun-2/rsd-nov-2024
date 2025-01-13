import {
    Card,
    CardContent,
    Box,
    Typography,
    IconButton,
    ButtonGroup,
    Button,
    Avatar,
    Link,
} from "@mui/material";

import { useState } from "react";
import { useApp } from "../AppProvider";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { fetchWithAuth } from "../utils/api";

import {
    Favorite as LikedIcon,
    FavoriteBorder as LikeIcon,
    Comment as CommentIcon,
} from "@mui/icons-material";

import UserListDialog from "./UserListDialog";

const API = "http://localhost:8080";

export default function Item({ post, navigateOnDelete = false }) {
    const { auth } = useApp();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [showLikes, setShowLikes] = useState(false);

    const isLiked = post.likes?.some(like => like.userId === auth?.id);

    const likeMutation = useMutation(
        () => fetchWithAuth(`/posts/${post.id}/like`, { method: isLiked ? "DELETE" : "POST" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("posts");
                queryClient.invalidateQueries("user");
                queryClient.invalidateQueries(["post", post.id.toString()]);
            },
        }
    );

    const deleteMutation = useMutation(
        () => fetchWithAuth(`/posts/${post.id}`, { method: "DELETE" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("posts");
                queryClient.invalidateQueries("user");
                
                if (navigateOnDelete) {
                    navigate('/');
                }
            },
        }
    );

    const handleLike = () => {
        if (!auth) {
            navigate("/login");
            return;
        }
        likeMutation.mutate();
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent
                onClick={() => navigate(`/posts/${post.id}`)}
                sx={{ 
                    cursor: "pointer",
                    "&:hover": {
                        bgcolor: "action.hover"
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                background: blue[500],
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/users/${post.user.id}`);
                            }}
                        >
                            {post.user.name[0]}
                        </Avatar>
                        <Link
                            component="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/users/${post.user.id}`);
                            }}
                            sx={{
                                textAlign: "left",
                                textTransform: "none",
                                fontWeight: "bold",
                                textDecoration: "none",
                            }}>
                            {post.user.name}
                        </Link>
                    </Box>
                    {auth && auth.id === post.user.id && (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteMutation.mutate();
                            }}>
                            <DeleteIcon sx={{ fontSize: 24, color: 'grey' }} />
                        </IconButton>
                    )}
                </Box>

                <Typography variant="body1" whiteSpace="pre-wrap">
                    {post.content}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        mt: 2,
                    }}>
                    <ButtonGroup sx={{ alignItems: "center" }}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike();
                            }}>
                            {isLiked ? (
                                <LikedIcon
                                    color="error"
                                    fontSize="inherit"
                                />
                            ) : (
                                <LikeIcon
                                    color="error"
                                    fontSize="inherit"
                                />
                            )}
                        </IconButton>
                        <Button
                            variant="text"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowLikes(true);
                            }}
                            sx={{ cursor: 'pointer' }}>
                            {post.likes?.length || 0}
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup sx={{ alignItems: "center" }}>
                        <IconButton 
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/posts/${post.id}`);
                            }}>
                            <CommentIcon
                                color="success"
                                sx={{ fontSize: 21 }}
                            />
                        </IconButton>
                        <Button
                            variant="text"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/posts/${post.id}`);
                            }}>
                            {post.comments?.length || 0}
                        </Button>
                    </ButtonGroup>
                </Box>
            </CardContent>

            <UserListDialog 
                open={showLikes}
                onClose={() => setShowLikes(false)}
                userId={post.id}
                type="likes"
                title="Liked by"
            />
        </Card>
    );
}
