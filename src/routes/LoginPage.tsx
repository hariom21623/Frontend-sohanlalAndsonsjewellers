import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { useAuth } from "../contexts/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/user";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const loggedInUser = await login({ email, password });

      if (loggedInUser.adminRole) {
        navigate("/admin/users");
      } else {
        navigate(from);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 380 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button type="submit" fullWidth variant="contained">
            Login
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}