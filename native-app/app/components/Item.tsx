import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

const styles = StyleSheet.create({
	card: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
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

export default function Item() {
	return (
		<View style={styles.card}>
			<View style={styles.cardHeader}>
				<View style={styles.author}>
					<Ionicons
						name="person-circle"
						size={32}
						color="#F72C5B"
					/>
					<Text style={styles.authorName}>Alice</Text>
					<Text style={styles.time}>4h</Text>
				</View>
				<TouchableOpacity>
					<Ionicons
						name="trash-outline"
						color="gray"
						size={18}
					/>
				</TouchableOpacity>
			</View>
			<View style={{ paddingLeft: 37 }}>
				<Text style={styles.content}>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Dolor vel voluptates similique corrupti voluptatibus?
				</Text>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 10,
					}}>
					<View style={{ flexDirection: "row", gap: 8 }}>
						<TouchableOpacity>
							<Ionicons
								name="heart-outline"
								size={18}
								color="red"
							/>
						</TouchableOpacity>
						<Text style={{ color: "gray" }}>12</Text>
					</View>
					<View style={{ flexDirection: "row", gap: 8 }}>
						<TouchableOpacity>
							<Ionicons
								name="chatbubble-outline"
								size={18}
								color="green"
							/>
						</TouchableOpacity>
						<Text style={{ color: "gray" }}>5</Text>
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
			</View>
		</View>
	);
}
