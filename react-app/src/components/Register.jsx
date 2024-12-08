import { Typography, Box, OutlinedInput, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submit = () => {
    navigate("/login");
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Register
      </Typography>
      <form onSubmit={handleSubmit(submit)}>
        <OutlinedInput
          fullWidth
          placeholder="Name"
          {...register("name", { required: true })}
        ></OutlinedInput>
        {errors.name && <Typography>This field is required</Typography>}

        <OutlinedInput
          fullWidth
          placeholder="Username"
          {...register("username", { required: true })}
        ></OutlinedInput>
        {errors.username && <Typography>This field is required</Typography>}

        <OutlinedInput
          fullWidth
          placeholder="Password"
          {...register("password", { required: true })}
        ></OutlinedInput>
        {errors.password && <Typography>This field is required</Typography>}

        <OutlinedInput
          fullWidth
          placeholder="Bio"
          {...register("bio")}
        ></OutlinedInput>

        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
}
