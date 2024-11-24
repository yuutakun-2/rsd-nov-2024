import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
} from "@mui/material";

import {
    Menu as MenuIcon,
    Add as AddIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";

export default function Header() {
    const { showForm, setShowForm, mode, setMode, setShowDrawer } = useApp();

	return (
		<AppBar position="static">
			<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                        color="inherit"
                        onClick={() => setShowDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
					<Typography>App</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 1 }}>
					<IconButton
						color="inherit"
						onClick={() => setShowForm(!showForm)}>
						<AddIcon />
					</IconButton>

					{mode == "dark" ? (
						<IconButton
							color="inherit"
							onClick={() => {
								setMode("light");
							}}>
							<LightModeIcon />
						</IconButton>
					) : (
						<IconButton
							color="inherit"
							onClick={() => {
								setMode("dark");
							}}>
							<DarkModeIcon />
						</IconButton>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
}
