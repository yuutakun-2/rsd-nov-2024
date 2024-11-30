import { Box, Typography, OutlinedInput, Button } from "@mui/material";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

export default function Register() {
	const { setAuth } = useApp();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const submitRegister = () => {
		navigate("/login");
	};

	return (
		<Box>
			<Typography variant="h3">Register</Typography>

			<form onSubmit={handleSubmit(submitRegister)}>
				<OutlinedInput
					{...register("name", { required: true })}
					fullWidth
					placeholder="name"
					sx={{ mt: 2 }}
				/>
				{errors.name && (
					<Typography color="error">name is required</Typography>
				)}

				<OutlinedInput
					{...register("username", { required: true })}
					fullWidth
					placeholder="username"
					sx={{ mt: 2 }}
				/>
				{errors.username && (
					<Typography color="error">username is required</Typography>
				)}

				<OutlinedInput
					{...register("bio")}
					fullWidth
					placeholder="bio"
					sx={{ mt: 2 }}
				/>

				<OutlinedInput
					{...register("password", { required: true })}
					fullWidth
					type="password"
					placeholder="password"
					sx={{ mt: 2 }}
				/>
				{errors.password && (
					<Typography color="error">password is required</Typography>
				)}

				<Button
					sx={{ mt: 2 }}
					type="submit"
					fullWidth
					variant="contained">
					Register
				</Button>
			</form>
		</Box>
	);
}
