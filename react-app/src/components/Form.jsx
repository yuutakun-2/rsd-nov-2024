import { useRef } from "react";

import {
    OutlinedInput,
    IconButton,
} from "@mui/material";

import {
    Add as AddIcon,
} from "@mui/icons-material";

import { useMutation, useQueryClient } from "react-query";
import { fetchWithAuth } from "../utils/api";

async function postPost(content) {
    return fetchWithAuth("/posts", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });
}

export default function Form() {
    const inputRef = useRef();
    const queryClient = useQueryClient();

    const add = useMutation(postPost, {
        onSuccess: async () => {
            queryClient.invalidateQueries("posts");
            if(inputRef.current) inputRef.current.value = "";
        }
    });

    return (
		<form
			style={{ marginBottom: 20, display: "flex" }}
			onSubmit={e => {
				e.preventDefault();

				const content = inputRef.current.value;
				content && add.mutate(content);

				e.currentTarget.reset();
			}}>
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