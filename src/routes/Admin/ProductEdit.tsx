import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem, IconButton, CircularProgress, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { getProductById, updateProduct } from "../../api/product";
import AdminLayout from "../../components/Admin/AdminLayout";

const categories = ["Gold", "Silver", "1Gram Gold Polished Jewellery"];
const subCategories = ["Women", "Men", "Baby Boy", "Baby Girl"];

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setForm(res.product || res);
      } catch (err) {
        console.error(err);
        alert("Failed to load product details assets");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  function change(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;

    setUploading(true);
    setProgress(0);
    const previews: string[] = [];

    for (const f of selected) {
      try {
        // 🔥 Optimized high-precision WebP sync loop
        const c = await imageCompression(f, {
          maxSizeMB: 0.06,            // Limits storage sizes to around 50KB range
          maxWidthOrHeight: 1024,     // Crystal clear bounds resolution grid
          useWebWorker: true,
          initialQuality: 0.85,       
          fileType: "image/webp",     // 🚀 FORCE WEBP TRANSFORMATION ON ADDED IMAGES
          onProgress: (p) => setProgress(Math.round(p)),
        });

        const dataUrl = await toDataUrl(c);
        previews.push(dataUrl);
      } catch (err) {
        console.error("Compression error:", err);
      }
    }

    setNewPreviews((prev) => prev.concat(previews));
    setUploading(false);
  }

  function removeExistingImage(index: number) {
    setForm({
      ...form,
      images: form.images.filter((_: any, i: number) => i !== index),
    });
  }

  function removeNewPreview(index: number) {
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit() {
    try {
      const images = (form.images || []).concat(newPreviews);

      const payload = {
        name: form.name,
        category: form.category,
        subCategory: form.subCategory,
        price: Number(form.price || 0),
        weight: Number(form.weight || 0),
        description: form.description || "",
        stock: Number(form.stock || 0),
        images,
      };

      await updateProduct(id!, payload);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  if (loading || !form) {
    return (
      <AdminLayout title="Edit Product">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <Box sx={{ maxWidth: 700, bgcolor: "#F9F6F0", p: 4, border: "1px solid #E5D5BC" }}>
        <TextField fullWidth name="name" label="Name" sx={{ mb: 2 }} value={form.name || ""} onChange={change} />

        <TextField select fullWidth name="category" label="Category" sx={{ mb: 2 }} value={form.category || ""} onChange={change}>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        <TextField select fullWidth name="subCategory" label="Sub Category" sx={{ mb: 2 }} value={form.subCategory || ""} onChange={change}>
          {subCategories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        <TextField fullWidth name="price" label="Price" type="number" sx={{ mb: 2 }} value={form.price || ""} onChange={change} />
        <TextField fullWidth name="weight" label="Weight" type="number" sx={{ mb: 2 }} value={form.weight || ""} onChange={change} />
        <TextField fullWidth name="stock" label="Stock" type="number" sx={{ mb: 2 }} value={form.stock || ""} onChange={change} />

        {/* EXISTING IMAGES */}
        <Box sx={{ mb: 1, color: "#6E6557" }}>Existing showroom assets:</Box>
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {(form.images || []).map((src: string, i: number) => (
            <Box key={i} sx={{ position: "relative" }}>
              <img
                src={src}
                alt={`product-${i}`}
                width={90}
                height={90}
                style={{ objectFit: "cover", borderRadius: 4, border: "1px solid #E5D5BC" }}
              />
              <IconButton
                size="small"
                onClick={() => removeExistingImage(i)}
                sx={{ position: "absolute", top: 0, right: 0, bgcolor: "rgba(255,255,255,0.7)" }}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button variant="outlined" component="label" disabled={uploading} sx={{ mb: 2, color: "#4A0E17", borderColor: "#4A0E17" }}>
          {uploading ? "Processing..." : "Add More Images"}
          <input hidden multiple type="file" accept="image/*" onChange={onFileChange} />
        </Button>

        {uploading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <CircularProgress size={24} sx={{ color: "#4A0E17" }} />
            <Typography variant="body2">{progress}% Re-optimizing file structures...</Typography>
          </Box>
        )}

        {/* NEW IMAGES PREVIEW */}
        <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {newPreviews.map((src, i) => (
            <Box key={i} sx={{ position: "relative" }}>
              <img
                src={src}
                alt={`new-${i}`}
                width={90}
                height={90}
                style={{ objectFit: "cover", borderRadius: 4, border: "1px solid #E5D5BC" }}
              />
              <IconButton
                size="small"
                onClick={() => removeNewPreview(i)}
                sx={{ position: "absolute", top: 0, right: 0, bgcolor: "rgba(255,255,255,0.7)" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <TextField
          fullWidth
          name="description"
          label="Description"
          multiline
          rows={4}
          sx={{ mb: 3 }}
          value={form.description || ""}
          onChange={change}
        />

        <Button 
          variant="contained" 
          fullWidth 
          onClick={submit} 
          disabled={uploading} 
          sx={{ bgcolor: "#4A0E17", py: 1.5, borderRadius: 0, fontWeight: 600, letterSpacing: "0.1em" }}
        >
          Update Product
        </Button>
      </Box>
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