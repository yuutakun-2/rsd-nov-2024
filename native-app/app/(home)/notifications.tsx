import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../../context/auth";
import { formatDistanceToNow } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../components/Text";
import { router } from "expo-router";

type Actor = {
	id: number;
	name: string;
	username: string;
};

type Post = {
	id: number;
	content: string;
};

type Notification = {
	id: number;
	type: "LIKE" | "COMMENT" | "FOLLOW" | "SHARE";
	message: string;
	created: string;
	read: boolean;
	actor: Actor;
	post?: Post;
};

const getNotificationIcon = (
	type: string
): { name: keyof typeof Ionicons.glyphMap; color: string } => {
	switch (type) {
		case "LIKE":
			return { name: "heart-outline", color: "#F72C5B" };
		case "COMMENT":
			return { name: "chatbubble-outline", color: "#007AFF" };
		case "FOLLOW":
			return { name: "person-add-outline", color: "#34C759" };
		case "SHARE":
			return { name: "share-outline", color: "#FF9500" };
		default:
			return { name: "notifications-outline", color: "#8E8E93" };
	}
};

const getNotificationMessage = (notification: Notification): string => {
	const actorName = notification.actor.name;

	switch (notification.type) {
		case "LIKE":
			return `${actorName} liked your post`;
		case "COMMENT":
			return `${actorName} commented on your post`;
		case "FOLLOW":
			return `${actorName} started following you`;
		case "SHARE":
			return `${actorName} shared your post`;
		default:
			return notification.message;
	}
};

async function fetchNotifications(token: string): Promise<Notification[]> {
	const res = await fetch("http://localhost:8080/notifications", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to fetch notifications");
	}

	return res.json();
}

async function markAsRead(token: string, id: number): Promise<Notification> {
	const res = await fetch(`http://localhost:8080/notifications/${id}/read`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Failed to mark notification as read");
	}

	return res.json();
}

export default function Notifications() {
	const { colors } = useTheme();
	const { token } = useAuth();
	const queryClient = useQueryClient();

	const {
		data: notifications,
		isLoading,
		error,
	} = useQuery(["notifications"], () => fetchNotifications(token!), {
		enabled: !!token,
	});

	const markAsReadMutation = useMutation(
		(id: number) => markAsRead(token!, id),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["notifications"]);
			},
		}
	);

	if (isLoading) return <Text>Loading...</Text>;
	if (error) return <Text>Error loading notifications</Text>;
	if (!notifications?.length)
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Text>No notifications</Text>
			</View>
		);

	const renderNotification = ({ item }: { item: Notification }) => {
		const icon = getNotificationIcon(item.type);
		return (
			<TouchableOpacity
				onPress={() => {
					markAsReadMutation.mutate(item.id);
					if (item.post) {
						router.push(`/posts/${item.post.id}`);
					} else if (item.actor) {
						router.push(`/users/${item.actor.id}`);
					}
				}}
				style={[
					styles.notificationItem,
					{
						backgroundColor: item.read
							? colors.background
							: colors.card,
					},
				]}>
				<View style={styles.container}>
					<View
						style={[
							styles.iconContainer,
							{ backgroundColor: icon.color + "20" },
						]}>
						<Ionicons
							name={icon.name}
							size={20}
							color={icon.color}
						/>
					</View>
					<View style={styles.content}>
						<Text style={[styles.message, { color: colors.text }]}>
							{getNotificationMessage(item)}
						</Text>
						<Text
							style={[
								styles.time,
								{ color: colors.text + "99" },
							]}>
							{formatDistanceToNow(new Date(item.created), {
								addSuffix: true,
							})}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<FlatList
			data={notifications}
			renderItem={renderNotification}
			keyExtractor={item => item.id.toString()}
			contentContainerStyle={styles.list}
			ItemSeparatorComponent={() => (
				<View
					style={[
						styles.separator,
						{ backgroundColor: colors.border },
					]}
				/>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	list: {
		paddingVertical: 0,
	},
	notificationItem: {
		paddingVertical: 12,
		paddingHorizontal: 15,
	},
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	content: {
		flex: 1,
	},
	message: {
		fontSize: 16,
		marginBottom: 4,
	},
	time: {
		fontSize: 13,
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		marginLeft: 63, // 15 (padding) + 36 (icon size) + 12 (margin)
	},
});
