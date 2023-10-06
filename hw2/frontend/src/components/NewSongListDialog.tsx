// 新增歌單視窗，import到Myplaylist底下
import { useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';

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
      fetchSongLists();
    } catch (error) {
      alert("Error: Failed to create songlist");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a song list</DialogTitle>
      <DialogContent>
        <Stack direction="column">
          <TextField
            inputRef={textfieldRef}
            label="Song List Name"
            variant="outlined"
            sx={{ mt: 2, width: '20ch'}}
            autoFocus
          />
          <TextField
            inputRef={textfielddescript}
            label="Description"
            variant="outlined"
            sx={{ mt: 2, width: '50ch'}}
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddSongList}>add</Button>
        <Button onClick={onClose}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}