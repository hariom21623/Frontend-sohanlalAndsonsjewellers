import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UserTable({ users, onEdit, onDelete }: any) {
  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 240 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone", flex: 1 },
    {
      field: "adminRole",
      headerName: "AdminRole",
      width: 120,
      renderCell: (params) => (params.row.adminRole ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => onEdit(params.row.id)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => onDelete(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 520, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        pagination
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        disableRowSelectionOnClick
      />
    </div>
  );
}
