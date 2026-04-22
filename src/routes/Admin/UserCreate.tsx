import React, { useState } from "react";
import { TextField, Button, Paper, Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import AdminLayout from "../../components/Admin/AdminLayout";
import { createUser } from "../../api/adminUser";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    adminRole: false,
  });

  async function handleSubmit() {
    try {
      await createUser(form);
      alert("User created successfully!");
      navigate("/admin/users");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create user");
    }
  }

  return (
    <AdminLayout title="Create New User">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add User</Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <TextField
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.adminRole}
                onChange={(e) => setForm({ ...form, adminRole: e.target.checked })}
              />
            }
            label="Admin Role"
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>Create</Button>
            <Button variant="outlined" onClick={() => navigate("/admin/users")}>Cancel</Button>
          </Box>

        </Box>
      </Paper>
    </AdminLayout>
  );
}
