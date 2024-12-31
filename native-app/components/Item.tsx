import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, QueryClient, useQueryClient } from "react-query";
import { formatDistance, getTime } from "date-fns";

import type { itemType } from "@/types/itemType";
import { useTheme } from "@react-navigation/native";

const api = "http://192.168.100.11:8080";

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
export function Item({ post }: { post: itemType }) {
  const queryClient = useQueryClient();
  const { colors } = useTheme();

  const remove = useMutation(deletePost, {
    onMutate: async (id) => {
      await queryClient.cancelQueries("posts");
      queryClient.setQueryData<itemType[] | undefined>("posts", (old) => {
        return old?.filter((post) => post.id !== id);
      });
    },
  });

  return (
    <View style={[styles.contentCard, { borderColor: colors.border }]}>
      <View style={styles.contentHeading}>
        <View style={styles.authorHeading}>
          <Ionicons name="person-circle" size={32} color="darkblue" />
          <Text style={styles.Profile}>{post.user.name}</Text>
          <Text>{formatDistance(new Date(), post.created)}</Text>
        </View>
        <Ionicons
          name="trash"
          size={24}
          onPress={() => remove.mutate(post.id)}
          color={colors.text}
        />
      </View>
      <Text style={styles.content}>
        <Text key={post.id}>{post.content}</Text>
      </Text>
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconWithLabel}>
          <Ionicons name="heart-outline" size={24} color="red" />
          <Text style={[styles.iconLabel, { color: colors.text }]}>24</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWithLabel}>
          <Ionicons name="chatbubble-outline" size={24} color="blue" />
          <Text style={[styles.iconLabel, { color: colors.text }]}>24</Text>
        </TouchableOpacity>
        <Ionicons name="share-social" size={24} color={colors.text} />
        <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  contentCard: {
    padding: 16,
    // borderBlockColor: "black",
    borderWidth: 1,
    // backgroundColor: "lightgrey",
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
    paddingLeft: 42,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  iconWithLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconLabel: {
    fontSize: 16,
    color: "black",
  },
});
