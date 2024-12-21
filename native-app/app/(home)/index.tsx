import { ScrollView } from "react-native";

import Item from "../components/Item";

export default function Index() {
	return (
		<ScrollView>
			<Item />
			<Item />
			<Item />
			<Item />
			<Item />
		</ScrollView>
	);
}
