import { useRef } from "react";

import {
    OutlinedInput,
    IconButton,
} from "@mui/material";

import {
    Add as AddIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

export default function Form({ add }) {
    const inputRef = useRef();

    return (
		<form
			style={{ marginBottom: 20, display: "flex" }}
			onSubmit={e => {
				e.preventDefault();

				const content = inputRef.current.value;
				content && add(content);

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