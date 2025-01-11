import { View, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

import Text from "../components/Text";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useMutation, useQueryClient } from "react-query";

import { formatDistance } from "date-fns";

import type { ItemType } from "../types/ItemType.tsx";

import { useAuth } from "../context/auth";

interface ItemProps {
    item: ItemType;
    hideActions?: boolean;
}

const styles = StyleSheet.create({
    card: {
        padding: 15,
        borderBottomWidth: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    author: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
    },
    time: {
        color: "gray",
    },
    authorName: {
        fontWeight: "bold",
        fontSize: 16,
    },
    content: {
        fontSize: 16,
        lineHeight: 26,
    },
});

async function deleteItem(id: number, token: string) {
    const res = await fetch(`http://localhost:8080/posts/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Network res was not ok");
    }

    return res.json();
}

async function likeItem(id: number, token: string) {
    const res = await fetch(`http://localhost:8080/posts/${id}/like`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to like post");
    }

    return res.json();
}

async function unlikeItem(id: number, token: string) {
    const res = await fetch(`http://localhost:8080/posts/${id}/like`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to unlike post");
    }

    return res.json();
}

export default function Item({ item, hideActions }: ItemProps) {
    const queryClient = useQueryClient();

    const { colors } = useTheme();

    const router = useRouter();

    const { user, token } = useAuth();

    const isLiked = item.likes?.some(like => like.userId === user?.id) || false;

    const remove = useMutation(
        (id: number) => deleteItem(id, token!),
        {
            onMutate: async id => {
                await queryClient.cancelQueries("posts");
                await queryClient.setQueryData<ItemType[] | undefined>(
                    "posts",
                    old => {
                        return old?.filter(item => item.id !== id);
                    }
                );
            },
        }
    );

    const like = useMutation(
        () => likeItem(item.id, token!),
        {
            onMutate: async () => {
                await queryClient.cancelQueries("posts");
                await queryClient.cancelQueries(["post", item.id.toString()]);

                // Update posts list
                await queryClient.setQueryData<ItemType[] | undefined>(
                    "posts",
                    old => {
                        return old?.map(post => {
                            if (post.id === item.id) {
                                return {
                                    ...post,
                                    likes: [...(post.likes || []), { id: Date.now(), userId: user!.id }],
                                };
                            }
                            return post;
                        });
                    }
                );

                // Update individual post
                await queryClient.setQueryData<ItemType | undefined>(
                    ["post", item.id.toString()],
                    old => {
                        if (!old) return undefined;
                        return {
                            ...old,
                            likes: [...(old.likes || []), { id: Date.now(), userId: user!.id }],
                        };
                    }
                );
            },
            onError: () => {
                queryClient.invalidateQueries("posts");
                queryClient.invalidateQueries(["post", item.id.toString()]);
            },
            onSettled: () => {
                queryClient.invalidateQueries("posts");
                queryClient.invalidateQueries(["post", item.id.toString()]);
            }
        }
    );

    const unlike = useMutation(
        () => unlikeItem(item.id, token!),
        {
            onMutate: async () => {
                await queryClient.cancelQueries("posts");
                await queryClient.cancelQueries(["post", item.id.toString()]);

                // Update posts list
                await queryClient.setQueryData<ItemType[] | undefined>(
                    "posts",
                    old => {
                        return old?.map(post => {
                            if (post.id === item.id) {
                                return {
                                    ...post,
                                    likes: post.likes?.filter(like => like.userId !== user!.id) || [],
                                };
                            }
                            return post;
                        });
                    }
                );

                // Update individual post
                await queryClient.setQueryData<ItemType | undefined>(
                    ["post", item.id.toString()],
                    old => {
                        if (!old) return undefined;
                        return {
                            ...old,
                            likes: old.likes?.filter(like => like.userId !== user!.id) || [],
                        };
                    }
                );
            },
            onError: () => {
                queryClient.invalidateQueries("posts");
                queryClient.invalidateQueries(["post", item.id.toString()]);
            },
            onSettled: () => {
                queryClient.invalidateQueries("posts");
                queryClient.invalidateQueries(["post", item.id.toString()]);
            }
        }
    );

    const handleLikePress = () => {
        if (isLiked) {
            unlike.mutate();
        } else {
            like.mutate();
        }
    };

    return (
        <View style={[styles.card, { borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <View style={styles.author}>
                    <Ionicons
                        name="person-circle"
                        size={32}
                        color="#F72C5B"
                    />
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/users/[id]",
                                params: { id: item.user.id },
                            })
                        }>
                        <Text style={styles.authorName}>{item.user.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.time}>
                        {formatDistance(new Date(), item.created)}
                    </Text>
                </View>
                {user?.id === item.user.id && (
                    <TouchableOpacity onPress={() => remove.mutate(item.id)}>
                        <Ionicons
                            name="trash-outline"
                            color="gray"
                            size={18}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ paddingLeft: 37 }}>
                <TouchableOpacity
                    onPress={() => router.push(`/posts/${item.id}`)}>
                    <Text style={styles.content}>{item.content}</Text>
                </TouchableOpacity>

                {!hideActions && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}>
                        <View style={{ flexDirection: "row", gap: 8 }}>
                            <TouchableOpacity
                                onPress={handleLikePress}
                                disabled={like.isLoading || unlike.isLoading}>
                                <Ionicons
                                    name={isLiked ? "heart" : "heart-outline"}
                                    size={18}
                                    color="#F72C5B"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: "/users/list",
                                        params: {
                                            id: item.id,
                                            type: "likes",
                                            title: "Likes"
                                        }
                                    })
                                }>
                                <Text style={{ color: "gray" }}>
                                    {item.likes?.length || 0}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", gap: 8 }}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", gap: 8 }}
                                onPress={() =>
                                    router.push({
                                        pathname: "/posts/[id]",
                                        params: { id: item.id },
                                    })
                                }>
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={18}
                                    color="green"
                                />
                                <Text style={{ color: "gray" }}>
                                    {item.comments?.length || 0}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity>
                            <Ionicons
                                name="share-social-outline"
                                size={18}
                                color="gray"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons
                                name="ellipsis-vertical-outline"
                                size={18}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}
