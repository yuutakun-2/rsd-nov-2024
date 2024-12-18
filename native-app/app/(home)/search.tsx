import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Search() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is Search.</Text>
      <Link href={"/profile"}>Profile</Link>
    </View>
  );
}
