import { Box, Typography, Button, Alert, OutlinedInput } from "@mui/material";
import { useForm } from "react-hook-form";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import { useMutation } from "react-query";

async function postLogin(data) {
  const res = await fetch(`${import.meta.env.VITE_API}/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Network response was not ok.");
  }

  return res.json();
}

export default function Login() {
  const { setAuth } = useApp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const submit = () => {
  //   setAuth(true);
  //   navigate("/");
  // };

  const login = useMutation(postLogin, {
    onSuccess: (data) => {
      setAuth(data.user);
      localStorage.setItem("token", data.token);
      navigate("/");
    },
  });

  const submit = (data) => {
    login.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Login
      </Typography>
      {login.isError && (
        <Alert severity="alert">Invalid username and password.</Alert>
      )}
      <form onSubmit={handleSubmit(submit)}>
        <OutlinedInput
          sx={{ mb: 2 }}
          fullWidth
          placeholder="username"
          {...register("username", { required: true })}
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
