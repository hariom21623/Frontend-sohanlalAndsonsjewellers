import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
  // 🔍 SEARCH FILTER LOGIC MATRIX
  // ---------------------------
  const filtered = users.filter((u) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;

    // Convert adminRole to many readable versions for seamless string lookup matchings
    const roleText = u.adminRole ? "yes admin true" : "no user false";

    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phoneNumber && u.phoneNumber.toLowerCase().includes(term)) ||
      roleText.includes(term)
    );
  });

  return (
    <AdminLayout title="Admin – All Users List">

      {/* =======================================================================
          🔥 FIXED: ACTION BAR CONTAINER (NO MORE BORDER COLLISION/TOUCHES IN SPLIT MODE)
          ======================================================================= */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "stretch", sm: "center" },
          mb: 4, 
          gap: 2, // 🚀 Fixed: Splitscreen par borders ko aapas mein chipkne se rokega
          flexWrap: "wrap"
        }}
      >
        
        {/* 🔍 HIGH VISIBILITY REFINERY INPUT BAR */}
        <TextField
          label="Search by Name, Email, Phone..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#4A0E17", fontSize: "1.1rem" }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: { xs: "100%", sm: "350px" },
            bgcolor: "#FFFFFF", 
            borderRadius: 0,    

            // 1. Input Typing Field and Label Contrast Custom Corrections
            "& .MuiInputBase-input": {
              color: "#4A0E17 !important", // Type kiya hua text hamesha deep burgundy dikhega
              fontWeight: 600,
              fontSize: "0.85rem",
            },
            "& .MuiInputLabel-root": {
              color: "#757575 !important", // Field definition string label tracking color
              fontSize: "0.85rem",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4A0E17 !important", 
            },

            // 2. Uniform Dynamic Layout Visible Borders
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              "& fieldset": {
                borderColor: "#A0A0A0 !important", // Fixed: Click se pehle hi crisp grey line saaf dikhegi
                borderWidth: "1px !important",
              },
              "&:hover fieldset": {
                borderColor: "#4A0E17 !important",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4A0E17 !important",
                borderWidth: "1.5px !important",
              },
            },
          }}
        />

        {/* ➕ LUXURY ACCENTUATED ENTRY TRIGGER BUTTON */}
        <Button
          variant="contained"
          onClick={() => navigate("/admin/users/create")}
          sx={{
            bgcolor: "#4A0E17 !important",
            color: "#E5D5BC !important",
            borderRadius: 0,
            boxShadow: "none",
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
            px: 4,
            py: 1.1,
            "&:hover": {
              bgcolor: "#2A050B !important",
              color: "#FFFFFF !important",
            }
          }}
        >
          + Add User
        </Button>
      </Box>

      {/* =======================================================================
          🚀 FIXED: CALCULATOR FLEX WRAP FRAMEWORK (STOPS TOTAL SCREEN SCROLL OVERFLOWS)
          ======================================================================= */}
      <Box
        sx={{
          width: "100%",
          maxWidth: {
            xs: "100%",
            md: "calc(100vw - 280px)" // 🚀 Fixed: Sidebar offsets matrix ko dynamically screen se block out kar dega
          },
          boxSizing: "border-box"
        }}
      >
        <UserTable
          users={filtered}
          onEdit={(id: string) => navigate(`/admin/users/edit/${id}`)}
          onDelete={(id: string) => setDeleteId(id)}
        />
      </Box>

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