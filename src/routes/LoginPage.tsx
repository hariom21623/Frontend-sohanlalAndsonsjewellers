import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Container, Divider } from "@mui/material";
import { useAuth } from "../contexts/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();

  // const from = location.state?.from || "/user";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const loggedInUser = await login({ email, password });

      // Yahan fix karo:
      if (loggedInUser.adminRole) {
        navigate("/admin/users", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError("Login failed");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FDFBF7", // 🚀 FIXED: Premium Soft Off-White Showroom Canvas Background
        py: { xs: 4, md: 6 },
        px: 2
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          p: { xs: 3, md: 5 },
          bgcolor: "#FFFFFF", // 🚀 FIXED: Pure White Card
          border: "1px solid rgba(229, 213, 188, 0.6)", // Luxury Gold Accents Lines
          borderRadius: 0, // Sharp geometric square corners
          boxShadow: "0px 12px 40px rgba(74, 14, 23, 0.03)" // Elite faint shadow matrix
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            fontFamily: '"Playfair Display", serif',
            color: "#4A0E17",
            letterSpacing: "0.02em",
            mb: 1
          }}
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#6E6557",
            fontFamily: '"Montserrat", sans-serif',
            letterSpacing: "0.05em",
            fontSize: "0.8rem",
            mb: 4
          }}
        >
          Sign in to access your registered luxury dashboard.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>{error}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              bgcolor: "#FAF8F5",
              "& fieldset": { borderColor: "rgba(229, 213, 188, 0.5)" },
              "&:hover fieldset": { borderColor: "#6E6557" },
              "&.Mui-focused fieldset": { borderColor: "#4A0E17" },

              // 🚀 🔥 ANTI-AUTOFILL ENGINE OVERRIDE: Kills browser background color distortion leaks completely!
              "& input": {
                color: "#1A1A1A !important",
                WebkitTextFillColor: "#1A1A1A !important",
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #FAF8F5 inset !important", // Locks inside container background to ivory cream
                  WebkitTextFillColor: "#1A1A1A !important", // Charcoal dark input values text
                  transition: "background-color 5000s ease-in-out 0s"
                }
              }
            },
            "& .MuiInputLabel-root": {
              color: "#6E6557",
              "&.Mui-focused": { color: "#4A0E17" }
            }
          }}
        >
          <TextField
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2.5 }}
          />

          <TextField
            label="Password"
            placeholder="Enter your password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 4 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#4A0E17", // Royal Showroom deep maroon button tone
              color: "#FDFBF7",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "0.15em",
              py: 1.6,
              borderRadius: 0,
              boxShadow: "none",
              transition: "background-color 0.3s ease",
              "&:hover": { backgroundColor: "#2C050B", boxShadow: "none" },
            }}
          >
            LOGIN
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(229, 213, 188, 0.4)" }} />

        <Typography variant="body2" align="center" sx={{ color: "#6E6557" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#4A0E17", fontWeight: 700, textDecoration: "none", letterSpacing: "0.02em" }}>
            Register Here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}