import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import Text from "./Text";

export interface User {
    id: number;
    name: string;
    username: string;
    bio: string | null;
    followersCount?: number;
    followingCount?: number;
}

interface UserListProps {
    users: User[];
}

export default function UserList({ users }: UserListProps) {
    const { colors } = useTheme();

    return (
        <FlatList
            data={users}
            renderItem={({ item: user }) => (
                <Pressable 
                    onPress={() => {
                        router.back(); // Dismiss the modal first
                        setTimeout(() => {
                            router.push(`/users/${user.id}`); // Navigate to user profile after modal is dismissed
                        }, 300);
                    }}>
                    <View style={styles.userCard}>
                        <View style={[styles.avatar, { backgroundColor: colors.border }]}>
                            <Ionicons name="person" size={16} color={colors.text + "4D"} />
                        </View>
                        <View style={styles.contentContainer}>
                            <View style={[styles.header, !user.bio && { marginBottom: 0 }]}>
                                <Text style={[styles.name, { color: colors.text }]}>
                                    {user.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.username,
                                        { color: colors.text + "B3" },
                                    ]}>
                                    @{user.username}
                                </Text>
                            </View>
                            {user.bio && (
                                <Text
                                    style={[
                                        styles.bio,
                                        { color: colors.text + "99" },
                                    ]}>
                                    {user.bio}
                                </Text>
                            )}
                            {(user.followersCount !== undefined || user.followingCount !== undefined) && (
                                <View style={styles.stats}>
                                    {user.followersCount !== undefined && (
                                        <Text
                                            style={[
                                                styles.statText,
                                                { color: colors.text + "99" },
                                            ]}>
                                            {user.followersCount} followers
                                        </Text>
                                    )}
                                    {user.followingCount !== undefined && (
                                        <Text
                                            style={[
                                                styles.statText,
                                                { color: colors.text + "99" },
                                            ]}>
                                            {user.followingCount} following
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </Pressable>
            )}
            keyExtractor={user => user.id.toString()}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => (
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        paddingVertical: 0,
        marginHorizontal: 15,
    },
    userCard: {
        flexDirection: "row",
        paddingVertical: 10,
        backgroundColor: "transparent",
        alignItems: "center",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },
    username: {
        fontSize: 14,
    },
    bio: {
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 18,
    },
    stats: {
        flexDirection: "row",
        gap: 15,
    },
    statText: {
        fontSize: 13,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 15,
    },
});
