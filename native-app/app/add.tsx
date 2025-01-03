import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import type { itemType } from "@/types/itemType";

// const api = "http://192.168.100.11:8080";
const api = process.env.EXPO_PUBLIC_API_ROUTE;

const addPost = async (content: string) => {
  const res = await fetch(`${api}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function Add() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<itemType>();
  const queryClient = useQueryClient();

  const onSubmit = (data: { content: string }) => {
    add.mutate(data.content);
    router.back();
  };

  const add = useMutation(addPost, {
    onSuccess: async (newPost) => {
      await queryClient.cancelQueries("posts");
      queryClient.setQueryData<itemType[] | undefined>("posts", (old) => {
        return old ? [newPost, ...old] : [newPost];
      });
    },
    onError: (error) => {
      console.error("Error posting content:", error);
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    input: {
      height: 200,
      width: 300,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="content"
        defaultValue=""
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.content && { borderColor: "red" }]}
            placeholder="Enter your post here"
            multiline
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <View style={{ margin: 12, padding: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: "Blue" }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={{ fontSize: 20 }}>Add Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
