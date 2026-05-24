// src/components/Admin/Product/ProductTable.tsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";

interface ProductTableProps {
  products: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const columns = [
    { field: "sku", headerName: "SKU-ID", flex: 1, headerClassName: 'super-app-theme--header' },
    { field: "name", headerName: "Name", flex: 1, headerClassName: 'super-app-theme--header' },
    { field: "category", headerName: "Category", flex: 1, headerClassName: 'super-app-theme--header' },
    { field: "subCategory", headerName: "Sub Category", flex: 1, headerClassName: 'super-app-theme--header' },
    { field: "price", headerName: "Price", flex: 1, headerClassName: 'super-app-theme--header', renderCell: (p: any) => `₹${Number(p.value).toLocaleString('en-IN')}` },
    { field: "stock", headerName: "Stock", flex: 1, headerClassName: 'super-app-theme--header' },

    {
      field: "images",
      headerName: "Images",
      width: 150,
      headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        let imgs = params.row.images;
        if (typeof imgs === "string") {
          try { imgs = JSON.parse(imgs); } catch { imgs = []; }
        }
        if (!Array.isArray(imgs)) imgs = [];

        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: 'center', height: '100%' }}>
            {imgs.slice(0, 3).map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                width={40}
                height={40}
                style={{
                  borderRadius: 0,
                  objectFit: "cover",
                  border: "1px solid rgba(229, 213, 188, 0.4)",
                }}
                alt="asset"
              />
            ))}
          </Box>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: 'center', height: '100%' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(params.row.id)}
            sx={{ 
              borderRadius: 0, 
              borderColor: '#4A0E17 !important', 
              color: '#4A0E17 !important', 
              fontSize: '0.75rem',
              fontWeight: 600,
              '&:hover': { borderColor: '#000', bgcolor: 'rgba(74,14,23,0.05)' } 
            }}
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => onDelete(params.row.id)}
            sx={{ borderRadius: 0, boxShadow: 'none', fontSize: '0.75rem' }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box 
      sx={{ 
        width: '100%', 
        bgcolor: '#FFFDF9 !important', // 🚀 Forces solid light canvas background framing parameters
        border: '1px solid rgba(229, 213, 188, 0.35)',
        boxShadow: '0px 8px 24px rgba(0,0,0,0.04)'
      }}
    >
      <DataGrid
        rows={products}
        columns={columns}
        autoHeight
        pagination
        pageSizeOptions={[10]}
        getRowId={(row) => row.id || row._id}
        sx={{
          border: 'none',
          borderRadius: 0,
          
          // 🔥 1. FORCING LIGHT ROW CANVAS BACKGROUND (Bypasses dark modes overrides permanently)
          "& .MuiDataGrid-main": {
            backgroundColor: "#FFFDF9 !important",
          },
          "& .MuiDataGrid-row": {
            backgroundColor: "#FFFDF9 !important", // No more black rows merging text views
          },
          
          // 🔥 2. FORCING RICH DARK BURGUNDY TEXT VISIBILITY FOR BODY CELL NODES
          "& .MuiDataGrid-cell": {
            color: '#4A0E17 !important', // 🚀 Fixed: Text turns deep dark burgundy and looks razor-sharp
            fontSize: '0.85rem !important',
            fontWeight: '600 !important',
            borderBottom: '1px solid rgba(229, 213, 188, 0.2) !important',
          },
          
          // Header Specifications Row Alignment Color Fixing
          "& .super-app-theme--header": {
            backgroundColor: "#F5EFE6 !important", // Smooth royal cream bar color
            borderBottom: '1px solid rgba(229, 213, 188, 0.4) !important',
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontFamily: '"Playfair Display", serif',
            fontWeight: '700 !important',
            fontSize: '0.9rem !important',
            color: "#4A0E17 !important", // Header links visibility matching titles guidelines
          },
          
          "& .MuiDataGrid-row:hover": {
            bgcolor: 'rgba(229, 213, 188, 0.15) !important'
          },
          
          // Bottom Controls Layer Pagination Panel Blocks Overrides
          "& .MuiDataGrid-footerContainer": {
            borderTop: '1px solid rgba(229, 213, 188, 0.3) !important',
            bgcolor: '#F5EFE6 !important',
            "& .MuiTablePagination-root, & .MuiTypography-root, & .MuiIconButton-root": {
              color: '#4A0E17 !important'
            }
          }
        }}
      />
    </Box>
  );
}