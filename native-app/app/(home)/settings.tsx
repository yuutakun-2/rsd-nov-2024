import { View } from "react-native";

import { ThemeSwitchButton } from "@/components/ThemeSwitchButton";

export default function Settings() {
	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ThemeSwitchButton />
		</View>
	);
}
