import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Text from "../components/Text";
import { useAuth } from "../context/auth";

type PostForm = {
	content: string;
};

const createPost = async (data: PostForm, token: string) => {
	const response = await fetch("http://localhost:8080/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to create post");
	}

	return response.json();
};

export default function Add() {
	const { token } = useAuth();
	const { colors } = useTheme();

	if (!token) {
		return (
			<View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
				<Text style={[styles.message, { color: colors.text }]}>
					Please login to create a post
				</Text>
				<Pressable
					style={[styles.loginButton, { backgroundColor: colors.primary }]}
					onPress={() => router.push("/login")}
				>
					<Text style={styles.loginButtonText}>Login</Text>
				</Pressable>
				<Pressable
					style={styles.cancelButton}
					onPress={() => router.back()}
				>
					<Text style={[styles.cancelButtonText, { color: "#F72C5B" }]}>Cancel</Text>
				</Pressable>
			</View>
		);
	}

	const queryClient = useQueryClient();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<PostForm>();

	const postMutation = useMutation(
		(data: PostForm) => createPost(data, token!),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("posts");
				router.back();
			},
		}
	);

	const onSubmit = (data: PostForm) => {
		postMutation.mutate(data);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>New Post</Text>
				<Pressable
					onPress={() => router.back()}
					style={styles.closeButton}>
					<Ionicons
						name="close"
						size={24}
						color={colors.text}
					/>
				</Pressable>
			</View>

			<Controller
				control={control}
				rules={{
					required: "Post content is required",
					maxLength: {
						value: 280,
						message: "Post must be less than 280 characters",
					},
				}}
				name="content"
				render={({ field: { onChange, value } }) => (
					<TextInput
						style={[
							styles.input,
							styles.contentInput,
							{ color: colors.text, borderColor: colors.border },
						]}
						onChangeText={onChange}
						value={value}
						placeholder="What's on your mind?"
						placeholderTextColor={colors.text + "80"}
						multiline
						numberOfLines={4}
						maxLength={280}
					/>
				)}
			/>
			{errors.content && (
				<Text style={styles.errorText}>{errors.content.message}</Text>
			)}

			<Pressable
				style={styles.button}
				onPress={handleSubmit(onSubmit)}
				disabled={postMutation.isLoading}>
				<Text style={styles.buttonText}>
					{postMutation.isLoading ? "Posting..." : "Post"}
				</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	closeButton: {
		padding: 8,
	},
	input: {
		borderWidth: 1,
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
	},
	contentInput: {
		height: 120,
		textAlignVertical: "top",
	},
	errorText: {
		color: "#FF3B30",
		marginBottom: 10,
	},
	button: {
		backgroundColor: "#007AFF",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	message: {
		fontSize: 16,
		marginBottom: 20,
		textAlign: 'center'
	},
	loginButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	loginButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '500'
	},
	cancelButton: {
		marginTop: 12,
		paddingVertical: 8,
	},
	cancelButtonText: {
		fontSize: 16,
	},
});
