import { useState } from "react";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from "@mui/material/Toolbar";

import NewSongListDialog from "@/components/NewSongListDialog";

export default function MyPlaylist() {
    const [newSongListDialogOpen, setNewSongListDialogOpen] = useState(false);
    return (
        <>
        <Toolbar>
            <Stack direction="row" spacing={1.5}>
                <Typography variant="h5" gutterBottom>
                    My Playlist
                </Typography>
                <Button variant="contained" color="success" onClick={() => setNewSongListDialogOpen(true)}>
                    ADD
                </Button>
                <Button variant="contained" color="success">
                    DELETE
                </Button>
            </Stack>
        </Toolbar>
        <NewSongListDialog open={newSongListDialogOpen} onClose={() => setNewSongListDialogOpen(false)}/>
        </>
);
}