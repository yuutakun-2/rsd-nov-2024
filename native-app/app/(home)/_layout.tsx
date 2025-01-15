import { Tabs, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useQuery } from "react-query";
import { useAuth } from "../../context/auth";
import Text from "../../components/Text";
import { ThemeSwitchButton } from "../../components/ThemeSwitchButton";

async function fetchUnreadCount(token: string): Promise<number> {
	const res = await fetch("http://localhost:8080/notifications", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to fetch notifications");
	}

	const notifications = await res.json();
	return notifications.filter((n: any) => !n.read).length;
}

function NotificationIcon({
	color,
	unreadCount,
}: {
	color: string;
	unreadCount?: number;
}) {
	return (
		<View>
			<Ionicons
				name="notifications-outline"
				size={24}
				color={color}
			/>
			{unreadCount ? (
				<View style={styles.badge}>
					<Text style={styles.badgeText}>
						{unreadCount > 99 ? "99+" : unreadCount}
					</Text>
				</View>
			) : null}
		</View>
	);
}

export default function Home() {
	const { token, user } = useAuth();
	const { data: unreadCount = 0 } = useQuery(
		["notifications", "unread"],
		() => fetchUnreadCount(token!),
		{
			enabled: !!token && !!user,
		}
	);

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#F72C5B",
			}}>
			<Tabs.Screen
				name="index"
				options={{
					headerShown: false,
					title: "Home",
					tabBarIcon: ({ color }) => (
						<Ionicons
							name="home-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: ({ color }) => (
						<Ionicons
							name="search-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="add"
				options={{
					title: "Add Post",
					tabBarIcon: ({ color }) => (
						<TouchableOpacity
							onPress={() => {
								router.push("/new");
							}}>
							<Ionicons
								name="add-circle-outline"
								size={24}
								color={color}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Tabs.Screen
				name="notifications"
				options={{
					title: "Notifications",
					tabBarIcon: ({ color }) => (
						<NotificationIcon
							color={color}
							unreadCount={user ? unreadCount : undefined}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerRight: () => (
						<View style={{ marginRight: 10 }}>
							<ThemeSwitchButton />
						</View>
					),
					tabBarIcon: ({ color }) => (
						<Ionicons
							name="person-circle-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	badge: {
		position: "absolute",
		top: -6,
		right: -10,
		backgroundColor: "#F72C5B",
		borderRadius: 10,
		minWidth: 20,
		height: 20,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 4,
	},
	badgeText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "600",
	},
});
