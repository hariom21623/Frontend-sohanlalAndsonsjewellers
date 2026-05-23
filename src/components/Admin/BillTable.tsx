import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Paper
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BillTable({ bills, onEdit, onDelete, onView }: any) {
  return (
    <TableContainer 
      component={Paper}
      sx={{
        borderRadius: 0,
        boxShadow: "0px 8px 24px rgba(0,0,0,0.04)",
        border: "1px solid rgba(229, 213, 188, 0.35)",
        bgcolor: "#F5EFE6 !important", // 🚀 FORCES CLEAN LIGHT BACKGROUND
      }}
    >
      <Table sx={{ bgcolor: "#F5EFE6 !important" }}>

        {/* 👑 HEADERS: Royal Cream Bar Background with Gold Dividing Lines */}
        <TableHead>
          <TableRow sx={{ bgcolor: "#F5EFE6 !important" }}>
            <TableCell sx={{ color: "#4A0E17 !important", fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "0.9rem", borderBottom: "2px solid rgba(229, 213, 188, 0.4)" }}>Invoice No</TableCell>
            <TableCell sx={{ color: "#4A0E17 !important", fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "0.9rem", borderBottom: "2px solid rgba(229, 213, 188, 0.4)" }}>Customer</TableCell>
            <TableCell sx={{ color: "#4A0E17 !important", fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "0.9rem", borderBottom: "2px solid rgba(229, 213, 188, 0.4)" }}>Phone</TableCell>
            <TableCell sx={{ color: "#4A0E17 !important", fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "0.9rem", borderBottom: "2px solid rgba(229, 213, 188, 0.4)" }}>Total</TableCell>
            <TableCell sx={{ color: "#4A0E17 !important", fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "0.9rem", borderBottom: "2px solid rgba(229, 213, 188, 0.4)" }}>GST</TableCell>
            <TableCell sx={{ color: "#4A0E17 !important", fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "0.9rem", borderBottom: "2px solid rgba(229, 213, 188, 0.4)" }}>Net</TableCell>
            <TableCell sx={{ color: "#4A0E17 !important", fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: "0.9rem", borderBottom: "2px solid rgba(229, 213, 188, 0.4)" }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        {/* 📋 BODY ROWS: Rich Contrast Dark Burgundy Text Formatting */}
        <TableBody>
          {bills.map((b: any) => (
            <TableRow 
              key={b.id}
              sx={{
                bgcolor: "#FFFDF9 !important",
                "&:hover": {
                  bgcolor: "rgba(229, 213, 188, 0.15) !important", // Smooth luxury golden hover tint
                }
              }}
            >
              <TableCell sx={{ color: "#222222 !important", fontWeight: 600, fontSize: "0.85rem", borderBottom: "1px solid #EDEDED" }}>{b.invoiceNo}</TableCell>
              <TableCell sx={{ color: "#222222 !important", fontWeight: 500, fontSize: "0.85rem", borderBottom: "1px solid #EDEDED" }}>{b.customerName}</TableCell>
              <TableCell sx={{ color: "#222222 !important", fontWeight: 500, fontSize: "0.85rem", borderBottom: "1px solid #EDEDED" }}>{b.customerPhone}</TableCell>
              <TableCell sx={{ color: "#4A0E17 !important", fontWeight: 600, fontSize: "0.85rem", borderBottom: "1px solid #EDEDED" }}>₹{Number(b.totalAmount).toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ color: "#4A0E17 !important", fontWeight: 500, fontSize: "0.85rem", borderBottom: "1px solid #EDEDED" }}>₹{Number(b.gstAmount).toLocaleString('en-IN')}</TableCell>
              <TableCell sx={{ color: "#4A0E17 !important", fontWeight: 700, fontSize: "0.85rem", borderBottom: "1px solid #EDEDED" }}>₹{Number(b.netAmount).toLocaleString('en-IN')}</TableCell>

              {/* ACTION BUTTON PACKS WITH MATCHED HOVERS */}
              <TableCell sx={{ borderBottom: "1px solid #EDEDED" }}>
                <IconButton 
                  onClick={() => onView(b.id)}
                  sx={{ color: "#4A0E17", "&:hover": { bgcolor: "rgba(74, 14, 23, 0.08)" } }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>

                <IconButton 
                  onClick={() => onEdit(b.id)}
                  sx={{ color: "#4A0E17", "&:hover": { bgcolor: "rgba(74, 14, 23, 0.08)" } }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton 
                  color="error" 
                  onClick={() => onDelete(b.id)}
                  sx={{ "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}