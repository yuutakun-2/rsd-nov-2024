import {
	View,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "react-query";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../components/Text";
import UserList from "../../components/UserList";
import { User } from "../../components/UserList";

type RouteParams = {
	id: string;
	type: "followers" | "following" | "likes";
	title: string;
};

const fetchUsers = async (id: string, type: string): Promise<User[]> => {
	let endpoint;
	if (type === "followers" || type === "following") {
		endpoint = `/users/${id}/${type}`;
	} else if (type === "likes") {
		endpoint = `/posts/${id}/likes`;
	} else {
		throw new Error("Invalid type");
	}

	const response = await fetch(`http://localhost:8080${endpoint}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${type}`);
	}

	return response.json();
};

export default function UserListModal() {
	const { colors } = useTheme();
	const params = useLocalSearchParams<RouteParams>();

	const {
		data: users,
		isLoading,
		error,
	} = useQuery(
		["users", params.id, params.type],
		() => fetchUsers(params.id, params.type),
		{
			enabled: !!params.id && !!params.type,
		}
	);

	return (
		<View
			style={[styles.container, { backgroundColor: colors.background }]}>
			<View style={[styles.header, { borderBottomColor: colors.border }]}>
				<Text style={[styles.title, { color: colors.text }]}>
					{params.title}
				</Text>
				<View style={styles.placeholder} />
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.closeButton}>
					<Ionicons
						name="close"
						size={24}
						color={colors.text}
					/>
				</TouchableOpacity>
			</View>

			{isLoading ? (
				<View style={styles.centered}>
					<ActivityIndicator
						size="large"
						color={colors.primary}
					/>
				</View>
			) : error ? (
				<View style={styles.centered}>
					<Text style={{ color: colors.text }}>
						Error loading users
					</Text>
				</View>
			) : !users?.length ? (
				<View style={styles.centered}>
					<Text style={{ color: colors.text }}>No users found</Text>
				</View>
			) : (
				<UserList users={users} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		height: 52,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingHorizontal: 15,
	},
	closeButton: {
		width: 32,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	placeholder: {
		width: 32,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
