import { View, StyleSheet, Pressable, Platform } from "react-native";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/Text";
import LatestFeed from "../../components/LatestFeed";
import FollowingFeed from "../../components/FollowingFeed";

export default function Index() {
	const [activeTab, setActiveTab] = useState<"latest" | "following">(
		"latest"
	);
	const { colors } = useTheme();

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={[
					styles.container,
					Platform.OS === "android" && styles.androidContainer,
				]}>
				<View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
					<Pressable
						style={[
							styles.tab,
							activeTab === "latest" && {
								borderBottomColor: "#F72C5B",
								borderBottomWidth: 2,
							},
						]}
						onPress={() => setActiveTab("latest")}>
						<Text
							style={[
								styles.tabText,
								{
									color:
										activeTab === "latest"
											? "#F72C5B"
											: colors.text,
								},
							]}>
							Latest
						</Text>
					</Pressable>
					<Pressable
						style={[
							styles.tab,
							activeTab === "following" && {
								borderBottomColor: "#F72C5B",
								borderBottomWidth: 2,
							},
						]}
						onPress={() => setActiveTab("following")}>
						<Text
							style={[
								styles.tabText,
								{
									color:
										activeTab === "following"
											? "#F72C5B"
											: colors.text,
								},
							]}>
							Following
						</Text>
					</Pressable>
				</View>

				{activeTab === "latest" ? <LatestFeed /> : <FollowingFeed />}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	androidContainer: {
		paddingTop: 20,
	},
	tabContainer: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	tab: {
		flex: 1,
		paddingVertical: 15,
		alignItems: "center",
	},
	tabText: {
		fontSize: 16,
		fontWeight: "600",
	},
});
