import { ScrollView, View, StyleSheet } from "react-native";
import Text from "./Text";
import { useQuery } from "react-query";
import { useAuth } from "../context/auth";
import Item from "./Item";
import type { ItemType } from "../types/ItemType";

async function fetchFollowingPosts(token: string): Promise<ItemType[]> {
    const res = await fetch("http://localhost:8080/posts/following", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch following posts");
    }

    return res.json();
}

export default function FollowingFeed() {
    const { token, user } = useAuth();

    const { data, error, isLoading } = useQuery<ItemType[], Error>(
        ["following-posts", token],
        () => fetchFollowingPosts(token!),
        {
            enabled: !!token && !!user,
        }
    );

    if (!token || !user) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.message}>Please login to see posts from people you follow</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.message}>Loading...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.message}>Error: {error.message}</Text>
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.message}>You haven't followed anyone yet</Text>
                <Text style={styles.submessage}>Posts from people you follow will appear here</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            {data.map(item => (
                <Item
                    key={item.id}
                    item={item}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        textAlign: 'center',
        marginBottom: 8,
    },
    submessage: {
        opacity: 0.7,
        textAlign: 'center',
    },
});
