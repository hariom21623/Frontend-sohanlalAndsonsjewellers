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
      setError(err?.response?.data?.message || err?.message || "Login failed");
    }
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",   // 🔥 FIX HERE
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 380,
          borderRadius: 3,
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#d4af37",
              color: "#000",
              fontWeight: 600,
              py: 1.2,
            }}
          >
            Login
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#d4af37" }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>

  );
}