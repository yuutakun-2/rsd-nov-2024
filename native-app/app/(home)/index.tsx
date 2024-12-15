import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    card: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    author: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
    },
    authorName: {
        fontWeight: "bold",
        fontSize: 18,
    },
    content: {
        fontSize: 18,
        lineHeight: 27,
    }
});

export default function Index() {
	return (
		<ScrollView style={styles.container}>
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<View style={styles.author}>
						<Ionicons
							name="person-circle"
							size={32}
							color="#F72C5B"
						/>
						<Text style={styles.authorName}>Alice</Text>
					</View>
					<TouchableOpacity>
						<Ionicons
							name="trash"
							color="gray"
							size={24}
						/>
					</TouchableOpacity>
				</View>
				<View>
					<Text style={styles.content}>
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Dolor vel voluptates similique corrupti
						voluptatibus?
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}
