import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import { deleteUser } from "../../api/adminUser";

export default function UserDeleteDialog({
  open,
  userId,
  onClose,
  onDeleted,
}: any) {
  async function handleDelete() {
    if (!userId) return;
    await deleteUser(userId);
    onDeleted();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete User?</DialogTitle>

      <DialogContent>
        <Typography>Are you sure you want to delete this user?</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
