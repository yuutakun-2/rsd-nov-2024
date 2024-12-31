import { useContext, createContext, useEffect, useState } from "react";
import { lightTheme, darkTheme } from "@/constants/themes";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";

import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

const THEME_CONTENT_KEY = "app-ui-theme";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemTheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === "dark");

  useEffect(() => {
    const loadTheme = async function () {
      const localStorageTheme = await AsyncStorage.getItem(THEME_CONTENT_KEY);
      if (localStorageTheme !== null) {
        setIsDark(localStorageTheme === "dark");
      }

      loadTheme();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    AsyncStorage.setItem(THEME_CONTENT_KEY, newTheme);
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <NavigationThemeProvider value={isDark ? darkTheme : lightTheme}>
        {children}
        <StatusBar style={isDark ? "dark" : "light"} />
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme should be used inside ThemeProvider");
  }

  return context;
};
