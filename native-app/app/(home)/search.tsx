import { View, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { useQuery } from "react-query";
import Text from "../../components/Text";
import { useAuth } from "../../context/auth";
import UserList, { User } from "../../components/UserList";

const searchUsers = async (query: string, token: string): Promise<User[]> => {
    if (!query.trim()) return [];

    const response = await fetch(
        `http://localhost:8080/search?q=${encodeURIComponent(query)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to search users");
    }

    return response.json();
};

export default function Search() {
    const { colors } = useTheme();
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: users, isLoading } = useQuery(
        ["users", searchQuery],
        () => (token ? searchUsers(searchQuery, token) : Promise.resolve([])),
        {
            enabled: !!token && searchQuery.length > 0,
            staleTime: 0,
        }
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.searchInput,
                    {
                        color: colors.text,
                        borderColor: colors.border,
                        backgroundColor: colors.card,
                    },
                ]}
                placeholder="Search users..."
                placeholderTextColor={colors.text + "80"}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
            />

            {isLoading && (
                <View style={styles.centered}>
                    <Text>Searching...</Text>
                </View>
            )}

            {users && users.length > 0 ? (
                <UserList users={users} />
            ) : searchQuery.length > 0 && !isLoading ? (
                <View style={styles.centered}>
                    <Text>No users found</Text>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5
    },
    searchInput: {
        height: 36,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        marginHorizontal: 15,
        marginVertical: 10,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
