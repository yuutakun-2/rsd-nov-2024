import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is Settings.</Text>
      <Link href={"/profile"}>Profile</Link>
    </View>
  );
}
