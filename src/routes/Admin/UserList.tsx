import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, TextField } from "@mui/material";
import { getAllUsers } from "../../api/adminUser";

import AdminLayout from "../../components/Admin/AdminLayout";
import UserTable from "../../components/Admin/UserTable";
import UserDeleteDialog from "./UserDeleteDialog";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await getAllUsers();
      const userList = res?.users || [];
      setUsers(userList);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  }

  // ---------------------------
  // 🔍 SEARCH FILTER
  // ---------------------------
  const filtered = users.filter((u) => {
  const term = search.toLowerCase();

  // Convert adminRole to many readable versions
  const roleText = u.adminRole ? "yes admin true" : "no user false";

  return (
    u.name.toLowerCase().includes(term) ||
    u.email.toLowerCase().includes(term) ||
    u.phoneNumber.toLowerCase().includes(term) ||
    roleText.includes(term)
  );
});


  return (
    <AdminLayout title="Admin – All Users List">

      {/* ---------- TOP ACTION BAR ---------- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        
        {/* 🔍 SEARCH BAR */}
        <TextField
          label="Search by Name, Email, Phone, AdminRole"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "350px" }}
        />

        {/* ➕ ADD BUTTON */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/users/create")}
        >
          + Add User
        </Button>
      </Box>

      {/* ---------- USER TABLE ---------- */}
      <UserTable
        users={filtered}
        onEdit={(id: string) => navigate(`/admin/users/edit/${id}`)}
        onDelete={(id: string) => setDeleteId(id)}
      />

      {/* ---------- DELETE DIALOG ---------- */}
      <UserDeleteDialog
        open={Boolean(deleteId)}
        userId={deleteId}
        onClose={() => setDeleteId(null)}
        onDeleted={loadUsers}
      />

    </AdminLayout>
  );
}
