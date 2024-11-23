import { useState } from "react";

import Header from "./components/Header";
import Item from "./components/Item";
import Form from "./components/Form";
import { useApp } from "./AppProvider";

import { Container } from "@mui/material";

export default function App() {
	const { showForm } = useApp();

	const [posts, setPosts] = useState([
		{ id: 3, content: "Some content", user: "Alice" },
		{ id: 2, content: "More content", user: "Alice" },
		{ id: 1, content: "Another content", user: "Bob" },
	]);

	const add = content => {
		const id = posts[0].id + 1;
		setPosts([{ id, content, user: "Alice" }, ...posts]);
	};

	const remove = id => {
		setPosts(posts.filter(post => post.id != id));
	};

	return (
		<div>
			<Header />

			<Container
				sx={{ mt: 4 }}
				maxWidth="md">
				{showForm && <Form add={add} />}

				{posts.map(post => (
					<Item
						key={post.id}
						post={post}
						remove={remove}
					/>
				))}
			</Container>
		</div>
	);
}
