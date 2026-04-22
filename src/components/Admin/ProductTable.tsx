import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";

export default function ProductTable({ products, onEdit, onDelete }: any) {
  const columns = [
    { field: "sku", headerName: "SKU-ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "subCategory", headerName: "Sub Category", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "stock", headerName: "Stock", flex: 1 },

    {
      field: "images",
      headerName: "Images",
      width: 150,
      renderCell: (params: any) => {
        let imgs = params.row.images;

        // If images stored as JSON string → parse it
        if (typeof imgs === "string") {
          try {
            imgs = JSON.parse(imgs);
          } catch {
            imgs = [];
          }
        }

        // Ensure array
        if (!Array.isArray(imgs)) imgs = [];

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {imgs.slice(0, 3).map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                width={40}
                height={40}
                style={{
                  borderRadius: 4,
                  objectFit: "cover",
                  border: "1px solid #ccc",
                }}
                alt="product"
              />
            ))}
          </Box>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(params.row.id)}
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => onDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <DataGrid
      rows={products}
      columns={columns}
      autoHeight
      pagination
      pageSizeOptions={[10]}
      getRowId={(row) => row.id}
    />
  );
}
