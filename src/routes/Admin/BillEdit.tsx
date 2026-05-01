import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import { getBillById, updateBill } from "../../api/adminBill";
import { useParams, useNavigate } from "react-router-dom";

export default function BillEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    discount: 0,
    gstPercent: 3,
    items: [],
  });

  const [item, setItem] = useState({ name: "", price: "", qty: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadBill = async () => {
      setLoading(true);
      try {
        const res = await getBillById(id);
        const bill = res.bill;

        setForm({
          customerName: bill.customerName,
          customerPhone: bill.customerPhone,
          customerEmail: bill.customerEmail || "",
          discount: bill.discount,
          gstPercent: bill.gstPercent,
          items: bill.items || [],
        });
      } catch (err) {
        console.error("Failed to load bill", err);
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, [id]);

  function addItem() {
    if (!item.name || !item.price) return;

    setForm({
      ...form,
      items: [...form.items, item],
    });

    setItem({ name: "", price: "", qty: 1 });
  }

  async function handleSubmit() {
    try {
      await updateBill(id!, form);
      alert("Bill Updated!");
      navigate("/admin/bills");
    } catch (err) {
      console.error("Update failed", err);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Edit Bill</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <TextField
          label="Customer Name"
          value={form.customerName}
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
        />

        <TextField
          label="Customer Phone"
          value={form.customerPhone}
          onChange={(e) =>
            setForm({ ...form, customerPhone: e.target.value })
          }
        />

        <TextField
          label="Customer Email"
          value={form.customerEmail}
          onChange={(e) =>
            setForm({ ...form, customerEmail: e.target.value })
          }
        />

        {/* ITEMS */}
        <Box sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1">Add Items</Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              label="Item Name"
              value={item.name}
              onChange={(e) =>
                setItem({ ...item, name: e.target.value })
              }
            />

            <TextField
              label="Price"
              type="number"
              value={item.price}
              onChange={(e) =>
                setItem({ ...item, price: e.target.value })
              }
            />

            <TextField
              label="Qty"
              type="number"
              value={item.qty}
              onChange={(e) =>
                setItem({ ...item, qty: Number(e.target.value) })
              }
            />

            <Button variant="contained" onClick={addItem}>
              Add
            </Button>
          </Box>

          {form.items.map((it: any, i: number) => (
            <Typography key={i} sx={{ mt: 1 }}>
              • {it.name} — ₹{it.price} × {it.qty}
            </Typography>
          ))}
        </Box>

        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
}