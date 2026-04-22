import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";

import { deleteBill } from "../../api/adminBill";

export default function BillDeleteDialog({ open, billId, onClose, onDeleted }: any) {

  async function handleDelete() {
    await deleteBill(billId);
    onDeleted();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Bill?</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this bill?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
