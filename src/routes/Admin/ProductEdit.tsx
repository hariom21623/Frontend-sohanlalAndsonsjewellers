import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem, IconButton } from "@mui/material";
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
  const [newPreviews, setNewPreviews] = useState<string[]>([]); // base64
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await getProductById(id!);
      setForm(res.product);
    } catch (err) {
      console.error(err);
      alert("Failed to load");
    }
  }

  function change(e: any) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;

    const compressedFiles: File[] = [];
    const previews: string[] = [];

    for (const f of selected) {
      const c = await imageCompression(f, { maxSizeMB: 0.2, maxWidthOrHeight: 1200, useWebWorker: true });
      compressedFiles.push(c);
      const dataUrl = await toDataUrl(c);
      previews.push(dataUrl);
    }

    setNewFiles(prev => prev.concat(compressedFiles));
    setNewPreviews(prev => prev.concat(previews));
  }

  function removeExistingImage(index: number) {
    setForm({ ...form, images: form.images.filter((_: any, i: number) => i !== index) });
  }

  function removeNewPreview(index: number) {
    setNewFiles(files => files.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  }

  async function submit() {
    try {
      // combine existing images (form.images) + newly added previews
      const images = (form.images || []).concat(newPreviews || []);

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
      alert("Updated");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  if (!form) return null;

  return (
    <AdminLayout title="Edit Product">
      <Box sx={{ maxWidth: 700 }}>
        <TextField fullWidth name="name" label="Name" sx={{ mb: 2 }} value={form.name} onChange={change} />
        <TextField select fullWidth name="category" label="Category" sx={{ mb: 2 }} value={form.category} onChange={change}>
          {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
        <TextField select fullWidth name="subCategory" label="Sub Category" sx={{ mb: 2 }} value={form.subCategory} onChange={change}>
          {subCategories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>

        <TextField fullWidth name="price" label="Price" type="number" sx={{ mb: 2 }} value={form.price} onChange={change} />
        <TextField fullWidth name="weight" label="Weight" type="number" sx={{ mb: 2 }} value={form.weight} onChange={change} />
        <TextField fullWidth name="stock" label="Stock" type="number" sx={{ mb: 2 }} value={form.stock} onChange={change} />

        <Box sx={{ mb: 1 }}>Existing images:</Box>
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {(form.images || []).map((src: string, i: number) => (
            <Box key={i} sx={{ position: "relative" }}>
              <img src={src} width={90} height={90} style={{ objectFit: "cover", borderRadius: 6 }} />
              <IconButton size="small" onClick={() => removeExistingImage(i)} sx={{ position: "absolute", top: 0, right: 0 }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
          Add Images
          <input hidden multiple type="file" accept="image/*" onChange={onFileChange} />
        </Button>

        <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {newPreviews.map((src, i) => (
            <Box key={i} sx={{ position: "relative" }}>
              <img src={src} width={90} height={90} style={{ objectFit: "cover", borderRadius: 6 }} />
              <IconButton size="small" onClick={() => removeNewPreview(i)} sx={{ position: "absolute", top: 0, right: 0 }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <TextField fullWidth name="description" label="Description" multiline rows={4} sx={{ mb: 2 }} value={form.description} onChange={change} />

        <Button variant="contained" onClick={submit}>Update Product</Button>
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
