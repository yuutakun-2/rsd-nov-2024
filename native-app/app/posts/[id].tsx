import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "react-query";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatDistance } from "date-fns";

import Item from "../../components/Item";
import Text from "../../components/Text";
import type { ItemType } from "../../types/ItemType";

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: "gray",
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
        color: "gray",
        fontSize: 15,
    },
});

async function fetchPost(id: string) {
    const res = await fetch(`http://localhost:8080/posts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
}

export default function Post() {
    const { id } = useLocalSearchParams();
    const { colors } = useTheme();

    const { data: post, isLoading } = useQuery<ItemType>(
        ["post", id],
        () => fetchPost(id as string)
    );

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.noComments}>Loading...</Text>
            </View>
        );
    }

    if (!post) {
        return (
            <View style={styles.container}>
                <Text style={styles.noComments}>Post not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Item item={post} />
            
            <View style={styles.commentsSection}>
                <Text style={[styles.commentsHeader, { borderBottomColor: colors.border }]}>
                    Comments ({post.comments?.length || 0})
                </Text>
                
                {post.comments && post.comments.length > 0 ? (
                    post.comments.map(comment => (
                        <View 
                            key={comment.id} 
                            style={[styles.comment, { borderBottomColor: colors.border }]}
                        >
                            <View style={styles.commentHeader}>
                                <Ionicons
                                    name="person-circle"
                                    size={32}
                                    color="#F72C5B"
                                />
                                <View>
                                    <Text style={styles.commentAuthor}>
                                        {comment.user.name}
                                    </Text>
                                    <Text style={styles.commentTime}>
                                        {formatDistance(new Date(comment.created), new Date(), { addSuffix: true })}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.commentContent}>{comment.content}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noComments}>No comments yet</Text>
                )}
            </View>
        </ScrollView>
    );
}
