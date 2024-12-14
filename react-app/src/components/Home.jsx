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

export default function Home() {
  const queryClient = useQueryClient();
  const { add, showForm } = useApp();
  const { data, error, isLoading } = useQuery("posts", fetchPosts);

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

      {data && data.map((post) => <Item key={post.id} post={post} />)}
    </div>
  );
}
