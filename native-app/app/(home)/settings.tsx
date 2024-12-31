import { Text, View } from "react-native";
import ThemeToggle from "@/components/ThemeToggle";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemeToggle />
    </View>
  );
}
