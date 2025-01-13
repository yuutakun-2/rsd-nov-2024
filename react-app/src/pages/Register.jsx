import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    useTheme,
} from "@mui/material";
import { fetchWithAuth } from "../utils/api";

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            await fetchWithAuth("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={onSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{ mb: 2 }}>
                        {loading ? "Loading..." : "Register"}
                    </Button>
                </form>

                <Typography align="center">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        style={{ 
                            textDecoration: "none", 
                            color: theme.palette.primary.main 
                        }}>
                        Login
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
