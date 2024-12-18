import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  contentCard: {
    padding: 16,
    borderBlockColor: "black",
    borderWidth: 1,
    backgroundColor: "lightgrey",
    borderRadius: 6,
  },
  contentHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  Profile: {
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
  },
});
export default function Index() {
  return (
    <ScrollView style={styles.section}>
      <View style={styles.contentCard}>
        <View style={styles.contentHeading}>
          <View style={styles.authorHeading}>
            <Ionicons name="person-circle" size={48} color="black" />
            <Text style={styles.Profile}>Arkar</Text>
          </View>
          <AntDesign name="delete" size={24} color="black" />
        </View>
        <Text style={styles.content}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
          mollitia ex est, voluptatum quaerat possimus voluptatibus laborum
          nihil aliquam placeat earum impedit, repudiandae illo id modi
          laudantium blanditiis assumenda molestias.
        </Text>
      </View>
    </ScrollView>
  );
}
