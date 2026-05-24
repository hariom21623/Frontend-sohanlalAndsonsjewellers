import { useEffect, useState } from "react";
import { Button, Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/product";
import AdminLayout from "../../components/Admin/AdminLayout";
import ProductTable from "../../components/Admin/ProductTable";
import ProductDeleteDialog from "./ProductDeleteDialog";

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
    setProducts(res.products || []);
  }

  // Frontend quick string match search execution track logic
  const filtered = products.filter((p: any) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return p.name && p.name.toLowerCase().includes(query);
  });

  return (
    <AdminLayout title="Products">
      
      {/* =========================================================
          🚀 UNIFIED ACTION CONTROL BAR BLOCK (FIXED SPACING & BORDERS)
          ========================================================= */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "stretch", sm: "center" },
          mb: 4, 
          gap: 2 
        }}
      >
        {/* OUTLINED VISIBLE TEXTFIELD CONTROLLER */}
        <TextField
          size="small"
          placeholder="Search Product By Name strictly..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#4A0E17", fontSize: "1.2rem" }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: { xs: "100%", sm: "340px" }, 
            bgcolor: "#FFFFFF",
            borderRadius: 0,
            
            // Text values visibility configuration controls
            "& .MuiInputBase-input": {
              color: "#4A0E17 !important", // Typed text stays crisp dark red-maroon
              fontSize: "0.85rem",
              fontWeight: 600,
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#757575 !important", // Fix placeholder text tracking view visibility
              opacity: 1,
            },
            
            // Fixed Outer Grid Border Visibility configuration states before click trigger
            "& .MuiOutlinedInput-root": { 
              borderRadius: 0,
              "& fieldset": { 
                borderColor: "#A0A0A0 !important", // Sharp clear grey border layout matching your mockup
                borderWidth: "1px !important"
              },
              "&:hover fieldset": { 
                borderColor: "#4A0E17 !important" 
              },
              "&.Mui-focused fieldset": { 
                borderColor: "#4A0E17 !important",
                borderWidth: "1.5px !important"
              } 
            } 
          }}
        />

        {/* CONTROLLERS HOOK BUTTON ACTION */}
        <Button 
          variant="contained" 
          onClick={() => navigate("/admin/products/create")} 
          sx={{ 
            bgcolor: "#4A0E17 !important", 
            color: "#E5D5BC !important",
            borderRadius: 0,
            boxShadow: 'none',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
            px: 4,
            py: 1.1,
            "&:hover": { bgcolor: "#2A050B !important", color: "#FFFFFF !important" }
          }}
        >
          + Add Product
        </Button>
      </Box>

      {/* CORE DATA DATAGRID TABLE ELEMENT VIEW MODULE */}
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