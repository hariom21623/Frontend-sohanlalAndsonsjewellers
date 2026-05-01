import React, { useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
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

  // ✅ Only previews needed (base64)
  const [previews, setPreviews] = useState<string[]>([]);

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;

    const previewUrls: string[] = [];

    for (const f of selected) {
      const compressed = await imageCompression(f, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      const dataUrl = await toDataUrl(compressed);
      previewUrls.push(dataUrl);
    }

    setPreviews((prev) => prev.concat(previewUrls));
  }

  async function handleSubmit() {
    const payload = {
      name: form.name,
      category: form.category,
      subCategory: form.subCategory,
      price: Number(form.price || 0),
      weight: Number(form.weight || 0),
      description: form.description || "",
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

        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
          Select Images
          <input hidden type="file" multiple accept="image/*" onChange={onFileChange} />
        </Button>

        {/* ✅ FIX: added alt */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`preview-${i}`}   // ✅ FIX
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

        <Button variant="contained" onClick={handleSubmit}>
          Create Product
        </Button>
      </Box>
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