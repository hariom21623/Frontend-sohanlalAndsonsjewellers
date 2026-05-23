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

// 🔥 LUXURY HIGH-CONTRAST TEXTFIELD OVERRIDES
const fieldStyles = {
  mb: 2.5,
  bgcolor: "#FFFFFF !important", 
  borderRadius: 0,

  // 1. Text Properties (Rich Dark Burgundy Colors Instead of Pale White Text)
  "& .MuiInputBase-input": {
    color: "#4A0E17 !important",
    fontWeight: 600,
    fontSize: "0.85rem",
  },
  "& .MuiInputLabel-root": {
    color: "#666666 !important", 
    fontSize: "0.85rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#4A0E17 !important", 
  },

  // 2. High Visibility Borders (Visible Instantly Before Click Trigger Actions)
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    "& fieldset": {
      borderColor: "#A0A0A0 !important", 
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
};

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
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.06,            
          maxWidthOrHeight: 1024,     
          useWebWorker: true,
          initialQuality: 0.85,       
          fileType: "image/webp",     
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
      <Box 
        sx={{ 
          maxWidth: 620, 
          bgcolor: "#FDFBF7", // Clean royal canvas backing workspace
          p: { xs: 2.5, sm: 4 }, 
          border: "1px solid rgba(229, 213, 188, 0.4)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.03)"
        }}
      >
        <TextField fullWidth name="name" label="Name" sx={fieldStyles} onChange={change} />

        <TextField select fullWidth name="category" label="Category" sx={fieldStyles} value={form.category} onChange={change}>
          {categories.map((c) => (
            <MenuItem key={c} value={c} sx={{ color: "#4A0E17" }}>{c}</MenuItem>
          ))}
        </TextField>

        <TextField select fullWidth name="subCategory" label="Sub Category" sx={fieldStyles} value={form.subCategory} onChange={change}>
          {subCategories.map((c) => (
            <MenuItem key={c} value={c} sx={{ color: "#4A0E17" }}>{c}</MenuItem>
          ))}
        </TextField>

        <TextField fullWidth name="price" label="Price" type="number" sx={fieldStyles} onChange={change} />
        <TextField fullWidth name="weight" label="Weight" type="number" sx={fieldStyles} onChange={change} />
        <TextField fullWidth name="stock" label="Stock" type="number" sx={fieldStyles} onChange={change} />

        {/* 📷 PREMIUM SELECT IMAGES BUTTON BUTTON */}
        <Button
          variant="outlined"
          component="label"
          disabled={uploading}
          sx={{ 
            mb: 2.5, 
            color: "#4A0E17 !important", 
            borderColor: "#4A0E17 !important",
            borderRadius: 0,
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
            py: 1,
            px: 3,
            "&:hover": {
              bgcolor: "rgba(74, 14, 23, 0.05) !important",
              borderColor: "#000000 !important"
            }
          }}
        >
          {uploading ? "Processing..." : "Select Images"}
          <input hidden type="file" multiple accept="image/*" onChange={onFileChange} />
        </Button>

        {uploading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
            <CircularProgress size={20} sx={{ color: "#4A0E17" }} />
            <Typography variant="body2" sx={{ color: "#4A0E17", fontWeight: 600 }}>
              {progress}% Optimizing into WebP format...
            </Typography>
          </Box>
        )}

        {/* IMAGE PREVIEWS SELECTION GRID NODES */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}>
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`preview-${i}`}
              width={84}
              height={84}
              style={{ 
                objectFit: "cover", 
                borderRadius: 0, 
                border: "1px solid rgba(74, 14, 23, 0.25)",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.06)"
              }}
            />
          ))}
        </Box>

        <TextField
          fullWidth
          name="description"
          label="Description"
          multiline
          rows={4}
          sx={fieldStyles}
          onChange={change}
        />

        {/* SUBMIT BUTTON ENGINE */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading}
          sx={{ 
            bgcolor: "#4A0E17 !important", 
            color: "#E5D5BC !important", 
            py: 1.5, 
            width: "100%", 
            borderRadius: 0, 
            fontWeight: 700, 
            letterSpacing: "0.1em",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#2A050B !important",
              color: "#FFFFFF !important"
            }
          }}
        >
          Create Product
        </Button>
      </Box>

      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert severity="success" variant="filled" sx={{ bgcolor: "#4A0E17", color: "#E5D5BC", borderRadius: 0 }}>
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