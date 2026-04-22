import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Paper
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BillTable({ bills, onEdit, onDelete, onView }: any) {
  return (
    <TableContainer component={Paper}>
      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Invoice No</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>GST</TableCell>
            <TableCell>Net</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {bills.map((b: any) => (
            <TableRow key={b.id}>
              <TableCell>{b.invoiceNo}</TableCell>
              <TableCell>{b.customerName}</TableCell>
              <TableCell>{b.customerPhone}</TableCell>
              <TableCell>₹{b.totalAmount}</TableCell>
              <TableCell>₹{b.gstAmount}</TableCell>
              <TableCell>₹{b.netAmount}</TableCell>

              <TableCell>
                <IconButton onClick={() => onView(b.id)}>
                  <VisibilityIcon />
                </IconButton>

                <IconButton onClick={() => onEdit(b.id)}>
                  <EditIcon />
                </IconButton>

                <IconButton color="error" onClick={() => onDelete(b.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}
