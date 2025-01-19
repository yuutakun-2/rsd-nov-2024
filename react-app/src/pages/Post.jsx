import { Container, Box, Typography, CircularProgress, Divider } from "@mui/material";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchWithAuth } from "../utils/api";

import Item from "../components/Item";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";

import { useApp } from "../AppProvider";

const API = "http://localhost:8080";

const fetchPost = async (id) => {
    return fetchWithAuth(`/posts/${id}`);
};

const deleteComment = async (commentId) => {
    return fetchWithAuth(`/comments/${commentId}`, {
        method: 'DELETE'
    });
};

export default function Post() {
    const { id } = useParams();
    const { auth } = useApp();
    const queryClient = useQueryClient();
    
    const { data: post, isLoading, error } = useQuery(
        ["post", id],
        () => fetchPost(id)
    );

    const { mutate: removeComment } = useMutation(deleteComment, {
        onSuccess: () => {
            queryClient.invalidateQueries(["post", id]);
        },
    });

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
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Item post={post} navigateOnDelete={true} />
            
            <Box sx={{ mt: 3 }}>
                <Box sx={{ mt: 2 }}>
                    {post.comments?.map(comment => (
                        <Comment 
                            key={comment.id} 
                            comment={comment}
                            remove={() => {
                                removeComment(comment.id);
                            }}
                        />
                    ))}
                </Box>

                {auth ? (
                    <CommentForm postId={id} />
                ) : (
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        Please login to comment
                    </Typography>
                )}
            </Box>
        </Container>
    );
}