import { View, Text, StyleSheet } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useMutation, QueryClient, useQueryClient } from "react-query";

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

const api = "http://192.168.31.191:8080";

async function deletePost(id: number) {
  const res = await fetch(`${api}/posts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}
// {post} : {post: Item}
export function Item({ post }: { post: Item }) {
  const queryClient = useQueryClient();

  const remove = useMutation(deletePost, {
    onMutate: async (id) => {
      await queryClient.cancelQueries("posts");
      queryClient.setQueryData<Item[] | undefined>("posts", (old) => {
        return old?.filter((post) => post.id !== id);
      });
    },
  });

  return (
    <View style={styles.contentCard}>
      <View style={styles.contentHeading}>
        <View style={styles.authorHeading}>
          <Ionicons name="person-circle" size={32} color="black" />
          <Text style={styles.Profile}>{post.user.name}</Text>
        </View>
        <AntDesign
          name="delete"
          size={24}
          color="black"
          onPress={() => remove.mutate(post.id)}
        />
      </View>
      <Text style={styles.content}>
        <Text key={post.id}>{post.content}</Text>
      </Text>
    </View>
  );
}

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
