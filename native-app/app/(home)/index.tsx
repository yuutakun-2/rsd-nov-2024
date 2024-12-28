import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useQuery } from "react-query";
import { Item } from "@/components/Item";

type Item = {
  id: number;
  title: string;
  content: string;
  userId: number;
  created: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    bio: string;
    created: string;
  };
};

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  contentCard: {
    padding: 16,
    borderBlockColor: "black",
    borderWidth: 1,
    backgroundColor: "lightgrey",
    borderRadius: 6,
    marginBottom: 12,
  },
  contentHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  authorHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  Profile: {
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
  },
});

const api = "http://192.168.100.11:8080";

async function fetchPosts(): Promise<Item[]> {
  const response = await fetch(`${api}/posts`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export default function Index() {
  const { data, error, isLoading } = useQuery<Item[], Error>(
    "posts",
    fetchPosts
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  if (!data) {
    return <Text>No data</Text>;
  }

  return (
    <ScrollView style={styles.section}>
      {data.map((post) => (
        <Item key={post.id} post={post} />
      ))}
    </ScrollView>
  );
}
