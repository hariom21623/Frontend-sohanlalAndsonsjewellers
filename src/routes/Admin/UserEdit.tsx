import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
  Typography,
} from "@mui/material";

import { getUserById, updateUser } from "../../api/adminUser";

export default function UserEdit() {
  const { id } = useParams();
  const [form, setForm] = useState<any>({
    name: "",
    phoneNumber: "",
    password: "",
    adminRole: false,
  });

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const res = await getUserById(id!);
    const user = res.data.user;

    setForm({
      name: user.name,
      phoneNumber: user.phoneNumber,
      password: "",
      adminRole: user.adminRole,
    });
  }

  async function handleSubmit() {
    await updateUser(id!, form);
    alert("User Updated");
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit User
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="Phone Number"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />

        <TextField
          label="New Password (optional)"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.adminRole}
              onChange={(e) =>
                setForm({ ...form, adminRole: e.target.checked })
              }
            />
          }
          label="Admin User"
        />

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
}
