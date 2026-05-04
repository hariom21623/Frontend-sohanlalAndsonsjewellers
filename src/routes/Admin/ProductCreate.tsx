import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { createProduct } from "../../api/product";
import AdminLayout from "../../components/Admin/AdminLayout";

const categories = ["Gold", "Silver", "1Gram Gold Polished Jewellery"];
const subCategories = ["Women", "Men", "Baby Boy", "Baby Girl"];

export default function ProductCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    name: "",
    category: "",
    subCategory: "",
    price: "",
    weight: "",
    description: "",
    stock: "",
  });

  const [previews, setPreviews] = useState<string[]>([]);

  // 🔥 NEW STATES
  const [uploading, setUploading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [progress, setProgress] = useState(0);

  function change(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    setUploading(true);
    setProgress(0);

    const previewUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.05, // ✅ better quality
          maxWidthOrHeight: 800,
          useWebWorker: true,
          initialQuality: 0.7,
          onProgress: (p) => setProgress(Math.round(p)),
        });

        const dataUrl = await toDataUrl(compressed);
        previewUrls.push(dataUrl);

      } catch (err) {
        console.error("Compression error:", err);
      }
    }

    setPreviews((prev) => [...prev, ...previewUrls]);

    setUploading(false);
    setOpenSnack(true); // ✅ popup
  }

  async function handleSubmit() {
    const payload = {
      ...form,
      price: Number(form.price || 0),
      weight: Number(form.weight || 0),
      stock: Number(form.stock || 0),
      images: previews,
    };

    try {
      await createProduct(payload);
      alert("Product created");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  }

  return (
    <AdminLayout title="Create Product">
      <Box sx={{ maxWidth: 600 }}>

        <TextField fullWidth name="name" label="Name" sx={{ mb: 2 }} onChange={change} />

        <TextField select fullWidth name="category" label="Category" sx={{ mb: 2 }} onChange={change}>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        <TextField select fullWidth name="subCategory" label="Sub Category" sx={{ mb: 2 }} onChange={change}>
          {subCategories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        <TextField fullWidth name="price" label="Price" type="number" sx={{ mb: 2 }} onChange={change} />
        <TextField fullWidth name="weight" label="Weight" type="number" sx={{ mb: 2 }} onChange={change} />
        <TextField fullWidth name="stock" label="Stock" type="number" sx={{ mb: 2 }} onChange={change} />

        {/* 🔥 FILE BUTTON */}
        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2 }}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Select Images"}
          <input hidden type="file" multiple accept="image/*" onChange={onFileChange} />
        </Button>

        {/* 🔥 LOADER */}
        {uploading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <CircularProgress size={24} />
            <span>{progress}% Compressing...</span>
          </Box>
        )}

        {/* PREVIEW */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`preview-${i}`}
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: 6 }}
            />
          ))}
        </Box>

        <TextField
          fullWidth
          name="description"
          label="Description"
          multiline
          rows={4}
          sx={{ mb: 2 }}
          onChange={change}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading}
        >
          Create Product
        </Button>
      </Box>

      {/* 🔥 SUCCESS POPUP */}
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert severity="success" variant="filled">
          Images uploaded successfully
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}

// helper
function toDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}