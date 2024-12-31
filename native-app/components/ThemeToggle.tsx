import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      {isDark ? (
        <Ionicons
          name="sunny-outline"
          size={64}
          color="white"
          onPress={toggleTheme}
        />
      ) : (
        <Ionicons name="moon-outline" size={64} onPress={toggleTheme} />
      )}
    </TouchableOpacity>
  );
}
