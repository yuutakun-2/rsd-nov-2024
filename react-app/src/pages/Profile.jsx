import {
	Container,
	Box,
	Typography,
	CircularProgress,
	Avatar,
} from "@mui/material";
import { useParams } from "react-router";
import { useQuery } from "react-query";

import Item from "../components/Item";
import FollowButton from "../components/FollowButton";
import { useApp } from "../AppProvider";

const API = "http://localhost:8080";

const fetchUser = async id => {
	const res = await fetch(`${API}/users/${id}`);
	if (!res.ok) throw new Error("Failed to fetch user");
	return res.json();
};

export default function Profile() {
	const { id } = useParams();
	const { auth } = useApp();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery(["user", id], () => fetchUser(id));

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ mt: 4, textAlign: "center" }}>
				<Typography color="error">
					Error loading profile: {error.message}
				</Typography>
			</Box>
		);
	}

	return (
		<Container maxWidth="sm" sx={{ py: 4 }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					mb: 4,
				}}>
				<Avatar sx={{ width: 120, height: 120, mb: 2, }}>
					{user.name[0]}
				</Avatar>
				<Typography variant="h4" gutterBottom>
					{user.name}
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" gutterBottom>
					@{user.username}
				</Typography>
				{user.bio && (
					<Typography variant="body1" textAlign="center" sx={{ mt: 1, mb: 2 }}>
						{user.bio}
					</Typography>
				)}
                
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {user._count?.followers || 0} followers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user._count?.following || 0} following
                    </Typography>
                </Box>

                <FollowButton 
                    userId={user.id} 
                    isFollowing={user.followers?.some(f => f.followerId === auth?.id)}
                />
			</Box>

			<Box sx={{ mt: 2 }}>
				{user.posts?.map(post => (
					<Item key={post.id} post={post} />
				))}
			</Box>
		</Container>
	);
}
