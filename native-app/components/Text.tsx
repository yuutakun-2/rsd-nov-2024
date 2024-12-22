import { Text as DefaultText, StyleProp, TextStyle } from "react-native";
import { useTheme } from "@react-navigation/native";

type TextProps = {
	style?: StyleProp<TextStyle>;
	children: string | React.ReactNode;
};

export default function Text({ style, children }: TextProps) {
	const { colors } = useTheme();

	return (
		<DefaultText style={[{ color: colors.text }, style]}>
			{children}
		</DefaultText>
	);
}
