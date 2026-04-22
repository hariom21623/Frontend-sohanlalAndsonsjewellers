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

  const filtered = products.filter((p: any) =>
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Products">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          placeholder="Search Product By SKU-ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="contained" onClick={() => navigate("/admin/products/create")}>
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
