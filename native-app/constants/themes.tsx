import {
  DefaultTheme as navigationDefaultTheme,
  DarkTheme as navigationDarkTheme,
} from "@react-navigation/native";

export const lightTheme = {
  ...navigationDefaultTheme,
  colors: {
    ...navigationDefaultTheme.colors,
    text: "#000000",
    border: "#ddd",
  },
};

export const darkTheme = {
  ...navigationDarkTheme,
  colors: {
    ...navigationDarkTheme.colors,
    text: "#ffffff",
    border: "#444",
  },
};
