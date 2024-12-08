import { Box, Typography, Button, Alert, OutlinedInput } from "@mui/material";
import { useForm } from "react-hook-form";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";

export default function Login() {
  const { setAuth } = useApp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = () => {
    setAuth(true);
    navigate("/");
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Login
      </Typography>
      <form onSubmit={handleSubmit(submit)}>
        <OutlinedInput
          sx={{ mb: 2 }}
          fullWidth
          placeholder="Name"
          {...register("name", { required: true })}
        ></OutlinedInput>
        {errors.name && <Typography>This field is required</Typography>}
        <OutlinedInput
          sx={{ mb: 2 }}
          fullWidth
          placeholder="Password"
          {...register("password", { required: true })}
        ></OutlinedInput>
        {errors.password && <Typography>This field is required</Typography>}
        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
}
