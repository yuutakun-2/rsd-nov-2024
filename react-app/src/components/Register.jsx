import { Box, Typography, Button, OutlinedInput } from "@mui/material";

export default function Register() {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Register
      </Typography>
      <form>
        <OutlinedInput
          sx={{ mb: 2 }}
          fullWidth
          placeholder="Name"
        ></OutlinedInput>
        <OutlinedInput
          sx={{ mb: 2 }}
          fullWidth
          placeholder="Name"
        ></OutlinedInput>
      </form>
      <Button type="submit" variant="contained" fullWidth>
        Submit
      </Button>
    </Box>
  );
}
