import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Typography
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
        // 🔥 Professional WebP Luxury Compression Engine
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.06,            // Strict target bounds around ~50-60KB
          maxWidthOrHeight: 1024,     // High dimensions to prevent jewelry carving blur
          useWebWorker: true,
          initialQuality: 0.85,       // High starting precision pass
          fileType: "image/webp",     // 🚀 FORCE WEBP FOR MAXIMUM COMPRESSION EFFICIENCY
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
    setOpenSnack(true);
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
      alert("Product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  }

  return (
    <AdminLayout title="Create Product">
      <Box sx={{ maxWidth: 600, bgcolor: "#F9F6F0", p: 4, border: "1px solid #E5D5BC" }}>
        <TextField fullWidth name="name" label="Name" sx={{ mb: 2 }} onChange={change} />

        <TextField select fullWidth name="category" label="Category" sx={{ mb: 2 }} value={form.category} onChange={change}>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        <TextField select fullWidth name="subCategory" label="Sub Category" sx={{ mb: 2 }} value={form.subCategory} onChange={change}>
          {subCategories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        <TextField fullWidth name="price" label="Price" type="number" sx={{ mb: 2 }} onChange={change} />
        <TextField fullWidth name="weight" label="Weight" type="number" sx={{ mb: 2 }} onChange={change} />
        <TextField fullWidth name="stock" label="Stock" type="number" sx={{ mb: 2 }} onChange={change} />

        <Button
          variant="outlined"
          component="label"
          disabled={uploading}
          sx={{ mb: 2, color: "#4A0E17", borderColor: "#4A0E17" }}
        >
          {uploading ? "Processing..." : "Select Images"}
          <input hidden type="file" multiple accept="image/*" onChange={onFileChange} />
        </Button>

        {uploading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <CircularProgress size={24} sx={{ color: "#4A0E17" }} />
            <Typography variant="body2">{progress}% Optimizing into WebP format...</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`preview-${i}`}
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: 4, border: "1px solid #E5D5BC" }}
            />
          ))}
        </Box>

        <TextField
          fullWidth
          name="description"
          label="Description"
          multiline
          rows={4}
          sx={{ mb: 3 }}
          onChange={change}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading}
          sx={{ bgcolor: "#4A0E17", py: 1.5, width: "100%", borderRadius: 0, fontWeight: 600, letterSpacing: "0.1em" }}
        >
          Create Product
        </Button>
      </Box>

      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert severity="success" variant="filled">
          Images processed into high-performance WebP formats!
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}

function toDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}