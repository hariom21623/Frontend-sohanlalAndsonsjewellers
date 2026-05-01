import { useEffect, useState } from "react";
import { Paper, Typography, Box, Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { getBillById } from "../../api/adminBill";

export default function BillView() {
  const { id } = useParams();

  const [bill, setBill] = useState<any>(null);
  const [pdfBase64, setPdfBase64] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadBill = async () => {
      setLoading(true);
      try {
        const res = await getBillById(id);
        setBill(res.bill);
        setPdfBase64(res.pdfBase64);
      } catch (err) {
        console.error("Failed to load bill", err);
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, [id]);

  if (loading || !bill) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = "data:application/pdf;base64," + pdfBase64;
    link.download = bill.invoiceNo + ".pdf";
    link.click();
  }

  function handlePrint() {
    const pdfWindow = window.open("");
    pdfWindow!.document.write(
      `<iframe width='100%' height='100%' src='data:application/pdf;base64,${pdfBase64}'></iframe>`
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Invoice Details
      </Typography>

      <Typography>Invoice No: {bill.invoiceNo}</Typography>
      <Typography>Bill No: {bill.billNo}</Typography>
      <Typography>Customer: {bill.customerName}</Typography>
      <Typography>Phone: {bill.customerPhone}</Typography>

      <Typography sx={{ mt: 3, fontWeight: 600 }}>Items:</Typography>
      {bill.items.map((it: any, i: number) => (
        <Typography key={i}>
          • {it.name} — ₹{it.price} × {it.qty}
        </Typography>
      ))}

      <Typography sx={{ mt: 2 }}>Total: ₹{bill.totalAmount}</Typography>
      <Typography>GST: ₹{bill.gstAmount}</Typography>
      <Typography>Net: ₹{bill.netAmount}</Typography>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleDownload}>
          DOWNLOAD PDF
        </Button>

        <Button variant="outlined" onClick={handlePrint}>
          PRINT BILL
        </Button>
      </Box>
    </Paper>
  );
}