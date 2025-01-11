import { useState } from "react";
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import Text from "../../components/Text";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistance } from "date-fns";
import Item from "../../components/Item";
import { useAuth } from "../../context/auth";
import type { ItemType } from "../../types/ItemType";

interface Comment {
    id: number;
    content: string;
    created: string;
    user: {
        id: number;
        name: string;
    };
}

async function fetchPost(id: string, token: string | null): Promise<ItemType | null> {
    try {
        const response = await fetch(`http://localhost:8080/posts/${id}`, {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    } catch (error) {
        return null;
    }
}

async function addComment(postId: number, content: string, token: string) {
    const res = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        throw new Error("Failed to add comment");
    }

    return res.json();
}

async function deleteComment(postId: number, commentId: number, token: string) {
    const res = await fetch(
        `http://localhost:8080/posts/${postId}/comments/${commentId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to delete comment");
    }

    return res.json();
}

export default function Post() {
    const { token, user } = useAuth();
    const { colors } = useTheme();
    const { id } = useLocalSearchParams();
    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();

    const { data: post, isLoading } = useQuery<ItemType | null>(
        ["post", id],
        () => fetchPost(id as string, token),
        {
            enabled: !!id,
        }
    );

    const addCommentMutation = useMutation(
        ({ postId, content }: { postId: number; content: string }) =>
            addComment(postId, content, token!),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["post", id]);
                setNewComment("");
            },
            onError: () => {
                Alert.alert("Error", "Failed to add comment");
            },
        }
    );

    const deleteCommentMutation = useMutation(
        ({ postId, commentId }: { postId: number; commentId: number }) =>
            deleteComment(postId, commentId, token!),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["post", id]);
            },
            onError: () => {
                Alert.alert("Error", "Failed to delete comment");
            },
        }
    );

    const handleAddComment = () => {
        if (!token) {
            Alert.alert("Error", "Please login to comment");
            return;
        }
        if (!newComment.trim()) return;
        addCommentMutation.mutate({ postId: post!.id, content: newComment });
    };

    const handleDeleteComment = (commentId: number) => {
        Alert.alert(
            "Delete Comment",
            "Are you sure you want to delete this comment?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteCommentMutation.mutate({
                            postId: post!.id,
                            commentId,
                        });
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Loading...</Text>
            </View>
        );
    }

    if (!post) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Post not found</Text>
            </View>
        );
    }

    return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.background }]}>
			<Item item={post} hideActions={true} />

			<View style={[styles.statsSection, { borderBottomColor: colors.border }]}>
				<TouchableOpacity
					onPress={() =>
						router.push({
							pathname: "/users/list",
							params: {
								id: post.id,
								type: "likes",
								title: "Likes",
							},
						})
					}
					style={styles.stat}>
					<Text style={[styles.statCount, { color: colors.text }]}>
						{post.likes?.length || 0}
					</Text>
					<Text
						style={[
							styles.statLabel,
							{ color: colors.text + "99" },
						]}>
						likes
					</Text>
				</TouchableOpacity>
				<View style={styles.stat}>
					<Text style={[styles.statCount, { color: colors.text }]}>
						{post.comments?.length || 0}
					</Text>
					<Text
						style={[
							styles.statLabel,
							{ color: colors.text + "99" },
						]}>
						comments
					</Text>
				</View>
			</View>

			<View style={styles.commentsSection}>
				{token ? (
					<>
						<TextInput
							style={[
								styles.commentInput,
								{
									borderColor: colors.border,
									color: colors.text,
								},
							]}
							placeholder="Write a comment..."
							placeholderTextColor={colors.text + "80"}
							value={newComment}
							onChangeText={setNewComment}
							multiline
						/>
						<TouchableOpacity
							style={styles.addButton}
							onPress={handleAddComment}
							disabled={addCommentMutation.isLoading}>
							<Text style={styles.addButtonText}>
								{addCommentMutation.isLoading
									? "Adding..."
									: "Add Comment"}
							</Text>
						</TouchableOpacity>
					</>
				) : (
					<TouchableOpacity
						style={[styles.addButton, { marginBottom: 16 }]}
						onPress={() => router.push("/login")}>
						<Text style={styles.addButtonText}>
							Login to Comment
						</Text>
					</TouchableOpacity>
				)}

				{post.comments && post.comments.length > 0 ? (
					post.comments.map(comment => (
						<View
							key={comment.id}
							style={[
								styles.comment,
								{ borderBottomColor: colors.border },
							]}>
							<View style={styles.commentHeader}>
								<Ionicons
									name="person-circle"
									size={32}
									color="#F72C5B"
								/>
								<View>
									<Text
										style={[
											styles.commentAuthor,
											{ color: colors.text },
										]}>
										{comment.user.name}
									</Text>
									<Text
										style={[
											styles.commentTime,
											{
												color: colors.text,
												opacity: 0.6,
											},
										]}>
										{formatDistance(
											new Date(comment.created),
											new Date(),
											{ addSuffix: true }
										)}
									</Text>
								</View>
								{comment.user.id === user?.id && (
									<TouchableOpacity
										style={styles.deleteButton}
										onPress={() =>
											handleDeleteComment(comment.id)
										}>
										<Ionicons
											name="trash-outline"
											size={20}
											color="#F72C5B"
										/>
									</TouchableOpacity>
								)}
							</View>
							<Text
								style={[
									styles.commentContent,
									{ color: colors.text },
								]}>
								{comment.content}
							</Text>
						</View>
					))
				) : (
					<Text
						style={[
							styles.noComments,
							{ color: colors.text, opacity: 0.6 },
						]}>
						No comments yet
					</Text>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statsSection: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    stat: {
        alignItems: "center",
    },
    statCount: {
        fontSize: 18,
        fontWeight: "600",
    },
    statLabel: {
        fontSize: 13,
    },
    commentsSection: {
        padding: 15,
    },
    commentsHeader: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    comment: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    commentAuthor: {
        fontWeight: "600",
        fontSize: 15,
    },
    commentTime: {
        fontSize: 13,
    },
    commentContent: {
        fontSize: 15,
        lineHeight: 20,
        paddingLeft: 40,
    },
    noComments: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 15,
    },
    commentInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        minHeight: 100,
        textAlignVertical: "top",
    },
    addButton: {
        backgroundColor: "#F72C5B",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    addButtonText: {
        color: "white",
        fontWeight: "600",
    },
    deleteButton: {
        marginLeft: "auto",
        padding: 8,
    },
});
