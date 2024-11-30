import {
	Box,
	Card,
	CardContent,
	IconButton,
	Typography,
	Avatar,
} from "@mui/material";

import { Delete as DeleteIcon } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

export default function Item({ post, remove }) {
	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}>
					<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
						<Avatar sx={{ width: 32, height: 32, background: blue[500] }} />
						<Typography sx={{ fontWeight: "bold" }}>
							{post.user}
						</Typography>
					</Box>
					<IconButton size="small" onClick={() => remove(post.id)}>
						<DeleteIcon sx={{ fontSize: 24 }} />
					</IconButton>
				</Box>

				<Typography>{post.content}</Typography>
			</CardContent>
		</Card>
	);
}
