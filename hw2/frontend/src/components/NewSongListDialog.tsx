// 歌曲編輯邏輯

import { useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import useSongs from "@/hooks/useSongs";
import { createSongList } from "@/utils/client";

type NewListDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function NewListDialog({ open, onClose }: NewListDialogProps) {
  const textfieldRef = useRef<HTMLInputElement>(null);
  const textfielddescript = useRef<HTMLInputElement>(null)
  const { fetchSongLists } = useSongs();

  const handleAddSongList = async () => {
    try {
      await createSongList({ name: textfieldRef.current?.value ?? "", description: textfielddescript.current?.value ?? ""});
      alert("Create");
      fetchSongLists();
    } catch (error) {
      alert("Error: Failed to create songlist");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a songlist</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={textfieldRef}
          label="SongList Name"
          variant="outlined"
          sx={{ mt: 2 }}
          autoFocus
        />
        <TextField
          inputRef={textfielddescript}
          label="Description"
          variant="outlined"
          sx={{ mt: 2 }}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddSongList}>add</Button>
        <Button onClick={onClose}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}