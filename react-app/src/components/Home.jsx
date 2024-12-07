import Item from "./Item";
import Form from "./Form";

import { useApp } from "../AppProvider";

export default function Home() {
  const { posts, setPosts, add, remove, showForm } = useApp();

  return (
    <div>
      {showForm && <Form add={add} />}

      {posts.map((post) => (
        <Item key={post.id} post={post} remove={remove} />
      ))}
    </div>
  );
}
