import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";

import ThemeProvider from "@/components/ThemeProvider";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack>
          <Stack.Screen
            name="(home)"
            options={{ title: "Home", headerShown: false }}
          />
          <Stack.Screen
            name="add"
            options={{ title: "Add", presentation: "modal" }}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
