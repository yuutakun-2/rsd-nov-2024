import { darkTheme, lightTheme } from "@/constants/themes";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type themeType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "app-ui-theme";

export default function ThemeProvider() {
  const systemTheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === "dark");

  useEffect(() => {
    const loadTheme = async () => {
      const saveTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saveTheme !== null) setIsDark(saveTheme === "dark");
    };

    loadTheme();
  }, []);
}
