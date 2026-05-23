import { useEffect, useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/Admin/AdminLayout";
import BillTable from "../../components/Admin/BillTable";
import BillDeleteDialog from "../Admin/BillDeleteDialog";

import { getAllBills, exportBillExcel } from "../../api/adminBill";

export default function BillList() {
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBills();
  }, []);

  async function loadBills() {
    const res = await getAllBills();
    setBills(res.bills || []);
  }

  const handleExport = async () => {
    try {
      const res = await exportBillExcel();

      const link = document.createElement("a");
      link.href =
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
        res.excelBase64;

      link.download = "Bills.xlsx";
      link.click();
    } catch (err) {
      console.error("Error Exporting:", err);
    }
  };


  const filtered = bills.filter((b: any) => {
    const t = search.toLowerCase();
    return (
      b.customerName.toLowerCase().includes(t) ||
      b.invoiceNo.toLowerCase().includes(t) ||
      b.billNo.toLowerCase().includes(t) ||
      b.customerPhone.toLowerCase().includes(t)
    );
  });

  return (
    <AdminLayout title="Bills List">

      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, // Mobile mode sets rows to full width columns
          justifyContent: "space-between", 
          alignItems: { xs: "stretch", sm: "center" },
          mb: 3, 
          gap: 2, // 🚀 Fixed: Splitscreen/Mobile par border chipkne se permanent bachaega
          flexWrap: "wrap" 
        }}
      >
        <TextField
          label="Search bills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{
            width: "300px",
            bgcolor: "#FFFFFF", // Content background color solid white
            borderRadius: 0,    // Pure luxury sharp edges

            // 1. INPUT TEXT AND FLOATING LABEL COLOR CORRECTION
            "& .MuiInputBase-input": {
              color: "#4A0E17 !important", // Type kiya hua text hamesha deep burgundy dikhega
              fontWeight: 600,
              fontSize: "0.85rem",
            },
            "& .MuiInputLabel-root": {
              color: "#757575 !important", // Dynamic field label text color before click
              fontSize: "0.85rem",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4A0E17 !important", // Clicks ke baad label sharp dark red ho jayega
            },

            // 2. STABLE HIGH VISIBILITY BORDERS (BEFORE AND AFTER CLICK)
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,

              // BEFORE CLICK (Idle state border hamesha visible rahega)
              "& fieldset": {
                borderColor: "#A0A0A0 !important", // Razor-sharp dynamic grey border
                borderWidth: "1px !important",
              },

              // ON MOUSE HOVER
              "&:hover fieldset": {
                borderColor: "#4A0E17 !important",
              },

              // AFTER CLICK (Active focus border)
              "&.Mui-focused fieldset": {
                borderColor: "#4A0E17 !important",
                borderWidth: "1.5px !important",
              },
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={handleExport}>
            Export Excel
          </Button>

          <Button variant="contained" onClick={() => navigate("/admin/bills/create")}>
            + Create Bill
          </Button>
        </Box>
      </Box>

      <BillTable
        bills={filtered}
        onEdit={(id: string) => navigate(`/admin/bills/edit/${id}`)}
        onView={(id: string) => navigate(`/admin/bills/view/${id}`)}
        onDelete={(id: string) => setDeleteId(id)}
      />

      <BillDeleteDialog
        open={Boolean(deleteId)}
        billId={deleteId}
        onClose={() => setDeleteId(null)}
        onDeleted={loadBills}
      />

    </AdminLayout>
  );
}
