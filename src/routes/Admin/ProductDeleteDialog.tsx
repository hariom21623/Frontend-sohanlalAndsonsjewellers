import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { deleteProduct } from "../../api/product";

export default function ProductDeleteDialog({ open, id, onClose, onDeleted }: any) {
  const handleDelete = async () => {
    await deleteProduct(id);
    onDeleted();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Delete Product?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
