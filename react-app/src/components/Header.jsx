import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
} from "@mui/material";

import {
    Add as AddIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

export default function Header() {
    const { showForm, setShowForm } = useApp();

	return (
		<AppBar position="static">
			<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
				<Typography>App</Typography>
				<IconButton
					color="inherit"
					onClick={() => setShowForm(!showForm)}>
					<AddIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
