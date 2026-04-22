import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Switch,
  FormControlLabel
} from "@mui/material";

import { createBill } from "../../api/adminBill";
import AdminLayout from "../../components/Admin/AdminLayout";
import { useNavigate } from "react-router-dom";

// ------------------------
// TYPES
// ------------------------
type BillItem = {
  name: string;
  price: number;
  qty: number;
};

type BillForm = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  discount: number;
  gstPercent: number;
  items: BillItem[];
};

export default function BillCreate() {
  const navigate = useNavigate();

  // ------------------------
  // FORM STATE
  // ------------------------
  const [form, setForm] = useState<BillForm>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    discount: 0, // amount
    gstPercent: 3, // default 3%
    items: [],
  });

  const [item, setItem] = useState<BillItem>({
    name: "",
    price: 0,
    qty: 1,
  });

  const [discountPercent, setDiscountPercent] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(true);

  // ------------------------
  // CALCULATE SUBTOTAL
  // ------------------------
  const subtotal = form.items.reduce(
    (sum, it) => sum + it.price * it.qty,
    0
  );

  // ------------------------
  // APPLY DISCOUNT BASED ON %
  // ------------------------
  function applyDiscount(total: number, percent: number) {
    return (total * percent) / 100;
  }

  // ------------------------
  // ADD ITEM
  // ------------------------
  function addItem() {
    if (!item.name || !item.price) {
      alert("Enter item name & price");
      return;
    }

    const updatedItems = [...form.items, item];
    const newTotal = updatedItems.reduce(
      (sum, it) => sum + it.price * it.qty,
      0
    );

    const newDiscount = applyDiscount(newTotal, discountPercent);

    setForm({
      ...form,
      items: updatedItems,
      discount: newDiscount,
      gstPercent: gstEnabled ? 3 : 0,
    });

    setItem({ name: "", price: 0, qty: 1 });
  }

  // ------------------------
  // SUBMIT BILL
  // ------------------------
  async function handleSubmit() {
    if (!form.items.length) return alert("Add at least 1 item");

    await createBill(form);
    alert("Bill Created!");
    navigate("/admin/bills");
  }

  return (
    <AdminLayout title="Create Bill">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Create New Bill</Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>

          {/* CUSTOMER FIELDS */}
          <TextField
            label="Customer Name"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />

          <TextField
            label="Customer Phone"
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          />

          <TextField
            label="Customer Email"
            value={form.customerEmail}
            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          />

          {/* GST SWITCH */}
          <FormControlLabel
            control={
              <Switch
                checked={gstEnabled}
                onChange={(e) => {
                  setGstEnabled(e.target.checked);
                  setForm({
                    ...form,
                    gstPercent: e.target.checked ? 3 : 0,
                  });
                }}
              />
            }
            label="Add GST (3%)"
          />

          {/* DISCOUNT DROPDOWN */}
          <TextField
            label="Discount (%)"
            select
            SelectProps={{ native: true }}
            value={discountPercent}
            onChange={(e) => {
              const percent = Number(e.target.value);
              setDiscountPercent(percent);
              const discountAmount = applyDiscount(subtotal, percent);

              setForm({
                ...form,
                discount: discountAmount,
              });
            }}
          >
            <option value={0}>0%</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
          </TextField>

          {/* ITEMS SECTION */}
          <Box sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1">Add Items</Typography>

            {/* ITEM INPUTS */}
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <TextField
                label="Item Name"
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
              />

              <TextField
                label="Price"
                type="number"
                value={item.price}
                onChange={(e) => setItem({ ...item, price: Number(e.target.value) })}
              />

              <TextField
                label="Qty"
                type="number"
                value={item.qty}
                onChange={(e) => setItem({ ...item, qty: Number(e.target.value) })}
              />

              <Button variant="contained" onClick={addItem}>
                Add
              </Button>
            </Box>

            {/* ITEMS LIST */}
            {form.items.map((it, i) => (
              <Typography key={i} sx={{ mt: 1 }}>
                • {it.name} — ₹{it.price} × {it.qty}
              </Typography>
            ))}
          </Box>

          {/* LIVE PREVIEW */}
          <Box sx={{ mt: 1 }}>
            <Typography>Subtotal: ₹{subtotal}</Typography>
            <Typography>Discount ({discountPercent}%): ₹{form.discount}</Typography>
            <Typography>GST ({form.gstPercent}%): Applied</Typography>
          </Box>

          {/* SUBMIT */}
          <Button variant="contained" onClick={handleSubmit}>
            Create Bill
          </Button>

        </Box>
      </Paper>
    </AdminLayout>
  );
}
