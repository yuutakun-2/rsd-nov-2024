import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../context/auth";
import { useTheme } from "@react-navigation/native";

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AuthProvider>
					<RootLayoutNav />
				</AuthProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

function RootLayoutNav() {
	const { colors } = useTheme();

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.background,
				},
				headerTintColor: colors.text,
				headerShadowVisible: false,
			}}>
			<Stack.Screen
				name="(home)"
				options={{
					title: "Home",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="login"
				options={{
					presentation: "modal",
					title: "Login",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="register"
				options={{
					presentation: "modal",
					title: "Register",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="add"
				options={{
					presentation: "modal",
					title: "New Post",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="posts/[id]"
				options={{
					title: "Post",
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerTintColor: colors.text,
					headerBackTitle: "Back",
				}}
			/>
			<Stack.Screen
				name="users/[id]"
				options={{
					title: "Profile",
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerTintColor: colors.text,
				}}
			/>
			<Stack.Screen
				name="users/list"
				options={{
					presentation: "modal",
					title: "New Post",
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
