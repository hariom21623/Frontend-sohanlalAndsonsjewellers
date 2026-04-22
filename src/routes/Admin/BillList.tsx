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

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Search bills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: "300px" }}
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
