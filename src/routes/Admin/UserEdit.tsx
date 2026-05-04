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
  CircularProgress,
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      setLoading(true);
      try {
        const res = await getUserById(id);
        const user = res.data.user;

        setForm({
          name: user.name || "",
          phoneNumber: user.phoneNumber || "",
          password: "",
          adminRole: user.adminRole || false,
        });
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  async function handleSubmit() {
    try {
      await updateUser(id!, form);
      alert("User Updated");
    } catch (err) {
      console.error("Update failed", err);
    }
  }

  // ✅ loading UI
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 500, margin: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit User
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
        />

        <TextField
          label="Phone Number"
          value={form.phoneNumber}
          onChange={(e) =>
            setForm({ ...form, phoneNumber: e.target.value })
          }
          fullWidth
        />

        <TextField
          label="New Password (optional)"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          fullWidth
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

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
}