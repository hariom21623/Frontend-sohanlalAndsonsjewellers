import { useEffect, useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/product";
import AdminLayout from "../../components/Admin/AdminLayout";
import ProductTable from "../../components/Admin/ProductTable";
import ProductDeleteDialog from "../Admin/ProductDeleteDialog";

export default function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await getAllProducts();
    setProducts(res.products);
  }

  // 🔥 STRICT LOGIC: Admin list mein search sirf Product Name ke basis par chalegi
  const filtered = products.filter((p: any) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    
    return p.name && p.name.toLowerCase().includes(query);
  });

  return (
    <AdminLayout title="Products">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search Product By Name strictly..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ 
            width: { xs: "100%", sm: "350px" }, 
            bgcolor: "#FFFFFF",
            "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#E5D5BC" } } 
          }}
        />

        <Button variant="contained" onClick={() => navigate("/admin/products/create")} sx={{ bgcolor: "#4A0E17", px: 3 }}>
          + Add Product
        </Button>
      </Box>

      <ProductTable
        products={filtered}
        onEdit={(id: string) => navigate(`/admin/products/edit/${id}`)}
        onDelete={(id: string) => setDeleteId(id)}
      />

      <ProductDeleteDialog
        open={Boolean(deleteId)}
        id={deleteId}
        onClose={() => setDeleteId(null)}
        onDeleted={loadProducts}
      />
    </AdminLayout>
  );
}