import { ScrollView, Text } from "react-native";
import { useQuery } from "react-query";
import Item from "./Item";
import type { ItemType } from "../types/ItemType";

async function fetchLatestPosts(): Promise<ItemType[]> {
    const res = await fetch("http://localhost:8080/posts");
    
    if (!res.ok) {
        throw new Error("Failed to fetch latest posts");
    }

    return res.json();
}

export default function LatestFeed() {
    const { data, error, isLoading } = useQuery<ItemType[], Error>(
        "latest-posts",
        fetchLatestPosts
    );

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
    if (!data) return <Text>No posts yet</Text>;

    return (
        <ScrollView>
            {data.map(item => (
                <Item
                    key={item.id}
                    item={item}
                />
            ))}
        </ScrollView>
    );
}
