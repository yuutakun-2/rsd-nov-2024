import Item from "./Item";
import Form from "./Form";
import { Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useApp } from "../AppProvider";

const api = "http://localhost:8080/posts";

async function fetchPosts() {
  const res = await fetch(api);

  return res.json();
}

async function deletePost(id) {
  const res = await fetch(`${api}/${id}`, { method: "DELETE" });
  return res.json();
}

export default function Home() {
  const queryClient = useQueryClient();
  const { add, showForm } = useApp();
  const { data, error, isLoading } = useQuery("posts", fetchPosts);

  // useMutation accepts two parameters:
  // first is a function reference which will connect with the API to actually operate the data into the backend
  // second is the function that will run before the mutation function (first function) runs
  const remove = useMutation(deletePost, {
    onMutate: (id) => {
      // write the code to change just the ui here
      // first the cache data should be updated (give cache key defined in useQuery above)
      queryClient.setQueryData("posts", (old) => {
        return old.filter((post) => {
          return post.id != id;
        });
      });
      // old refers to the old cache data, which is all posts within the database
      // in old.filter(post), post refers to each post
    },
  });

  // တချို့နေရာတွေမှာ Data မရောက်သေးဘဲ Component ကို အသုံးပြုမိရင် Error တက်နိုင်ပါတယ်။ ဒါကြောင့် ဒီပြဿနာကို ထည့်ဖြေရှင်းဖို့လိုပါတယ်။ ဒါကြောင့် Home.jsx ကို အခုလိုပြင်လိုက်ပါ။
  // if (error) {
  //   return <Typography>{error}</Typography>;
  // }
  // if (isLoading) {
  //   return <Typography>Loading...</Typography>;
  // }
  // If these codes are used, when isLoading is false => data is available => able to be used, so no need for data &&

  return (
    <div>
      {showForm && <Form add={add} />}

      {data &&
        data.map((post) => (
          <Item key={post.id} post={post} remove={remove.mutate} />
        ))}
    </div>
  );
}
