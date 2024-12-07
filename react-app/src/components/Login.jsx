import { Box, Typography, Button, Alert, OutlinedInput } from "@mui/material";
import { useState, useRef } from "react";

export default function Login() {
  const [error, setError] = useState();
  const nameRef = useRef();
  const passwordRef = useRef();
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Login
      </Typography>
      <form>
        {error && <Alert severity="warning"></Alert>}
        <OutlinedInput
          sx={{ mb: 2 }}
          fullWidth
          placeholder="Name"
          inputRef={nameRef}
        ></OutlinedInput>
        <OutlinedInput
          sx={{ mb: 2 }}
          fullWidth
          placeholder="Password"
          inputRef={passwordRef}
        ></OutlinedInput>
        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
}
