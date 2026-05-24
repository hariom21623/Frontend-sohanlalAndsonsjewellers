import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Container, Divider } from "@mui/material";
import { useAuth } from "../contexts/AuthProvider";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  
  const [error, setError] = useState<string | null>(null);

  // 🚀 NEW STATE: Password max limit dynamic alert indicator trigger
  const [passwordMaxError, setPasswordMaxError] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // 🚀 1. SMART PASSWORD VALIDATOR ENGINE (Blocks input and alerts user at exactly 15 chars)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.length <= 15) {
      setPassword(value);
      setPasswordMaxError(false); // Reset warning if they delete characters
    } else {
      // 🔥 🔥 Trigger instant visual response if they try to cross the 15 character threshold
      setPasswordMaxError(true);
    }
  };

  // 🚀 2. STRICT PHONE NUMBER VALIDATOR ENGINE
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  // 🚀 3. STRICT ALTERNATE PHONE VALIDATOR ENGINE
  const handleAlternatePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setAlternatePhone(value);
    }
  };

  // 🚀 4. PINCODE VALIDATOR ENGINE
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPincode(value);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await register({ 
        name, 
        email, 
        password, 
        phoneNumber, 
        address, 
        pincode, 
        alternatePhone 
      });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  }

  // 🚀 5. GATEKEEPER VALIDATION CHECK
  const isFormInvalid = 
    !name.trim() || 
    !email.trim() || 
    !address.trim() || 
    phoneNumber.length !== 10 ||              
    pincode.length !== 6 ||                   
    password.length < 6 || password.length > 15; 

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FDFBF7", 
        py: { xs: 4, md: 6 },
        px: 2
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{
          p: { xs: 3, md: 5 },
          bgcolor: "#FFFFFF", 
          border: "1px solid rgba(229, 213, 188, 0.6)", 
          borderRadius: 0, 
          boxShadow: "0px 12px 40px rgba(74, 14, 23, 0.03)" 
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
          Create Account
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
          Join our premium digital showroom experience.
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
              "& input": { 
                color: "#1A1A1A !important",
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #FAF8F5 inset !important", 
                  WebkitTextFillColor: "#1A1A1A !important", 
                  transition: "background-color 5000s ease-in-out 0s"
                }
              },
              "& textarea": {
                color: "#1A1A1A !important",
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #FAF8F5 inset !important",
                  WebkitTextFillColor: "#1A1A1A !important",
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
          <TextField label="Full Name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required sx={{ mb: 2.5 }} />
          <TextField label="Email Address" placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required sx={{ mb: 2.5 }} />
          
          {/* 🚀 🔥 DYNAMIC PASSWORD ENGINE DETECTOR */}
          <TextField 
            label="Password" 
            placeholder="6 to 15 characters" 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} // Connected to new alert framework logic
            fullWidth 
            required 
            helperText={
              passwordMaxError 
                ? "🔒 Maximum limit reached! Password cannot exceed 15 characters." 
                : (password && password.length < 6) 
                  ? "Password must be at least 6 characters long" 
                  : ""
            }
            error={Boolean((password && password.length < 6) || passwordMaxError)}
            sx={{ mb: 2.5 }} 
          />

          <TextField 
            label="Primary Phone Number" 
            placeholder="10-digit mobile number" 
            value={phoneNumber} 
            onChange={handlePhoneChange} 
            fullWidth 
            required 
            helperText={phoneNumber && phoneNumber.length !== 10 ? "Must be exactly 10 digits" : ""}
            error={Boolean(phoneNumber && phoneNumber.length !== 10)}
            sx={{ mb: 2.5 }} 
          />
          
          <TextField label="Full Delivery Address" placeholder="House No., Street Area, Landmark, City" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth required multiline rows={3} sx={{ mb: 2.5 }} />
          
          <TextField 
            label="Area Pincode" 
            placeholder="6-Digit Postal Code" 
            value={pincode} 
            onChange={handlePincodeChange} 
            fullWidth 
            required 
            helperText={pincode && pincode.length !== 6 ? "Must be exactly 6 digits" : ""}
            error={Boolean(pincode && pincode.length !== 6)}
            sx={{ mb: 2.5 }} 
          />

          <TextField 
            label="Alternate Number (Optional)" 
            placeholder="Backup contact number (Max 10 digits)" 
            value={alternatePhone} 
            onChange={handleAlternatePhoneChange} 
            fullWidth 
            sx={{ mb: 4 }} 
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isFormInvalid} 
            sx={{
              backgroundColor: "#4A0E17", 
              color: "#FDFBF7",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "0.15em",
              py: 1.6,
              borderRadius: 0,
              boxShadow: "none",
              transition: "all 0.3s ease",
              "&.Mui-disabled": {
                backgroundColor: "rgba(74, 14, 23, 0.3) !important", 
                color: "rgba(253, 251, 247, 0.6) !important"
              },
              "&:hover": { backgroundColor: "#2C050B", boxShadow: "none" },
            }}
          >
            REGISTER
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(229, 213, 188, 0.4)" }} />

        <Typography variant="body2" align="center" sx={{ color: "#6E6557" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4A0E17", fontWeight: 700, textDecoration: "none", letterSpacing: "0.02em" }}>
            Login Here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}