import { useRef } from "react";

import { OutlinedInput, IconButton } from "@mui/material";

import { Add as AddIcon } from "@mui/icons-material";
import { useMutation, useQueryClient } from "react-query";

const api = "http://localhost:8080/posts";
async function postPost(content) {
  const res = await fetch(api, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export default function Form() {
  const inputRef = useRef();
  const queryClient = useQueryClient();

  const add = useMutation(postPost, {
    onSuccess: async (content) => {
      await queryClient.cancelQueries();
      await queryClient.setQueryData("posts", (old) => {
        return [content, ...old];
      });
    },
  });

  return (
    <form
      style={{ marginBottom: 20, display: "flex" }}
      onSubmit={(e) => {
        e.preventDefault();

        const content = inputRef.current.value;
        content && add.mutate(content);

        e.currentTarget.reset();
      }}
    >
      <OutlinedInput
        type="text"
        style={{ flexGrow: 1 }}
        inputRef={inputRef}
        endAdornment={
          <IconButton type="submit">
            <AddIcon />
          </IconButton>
        }
      />
    </form>
  );
}
