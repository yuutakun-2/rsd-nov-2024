import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./ThemeProvider";
import { TouchableOpacity } from "react-native";

export const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme}>
      {isDark ? (
        <Ionicons name="sunny-outline" size={64} color="white" />
      ) : (
        <Ionicons name="moon-outline" size={64} />
      )}
    </TouchableOpacity>
  );
};