import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import type { SongProps } from "./Song";
import Song from "./Song";
import useSongs from "@/hooks/useSongs";
import { deleteSong } from "@/utils/client";

export type DeleteSongsConfirmProps = {
    songs: SongProps[];
    openConfirm: boolean;
    onClick: () => void;
    onDelete: () => void;
};

export default function DeleteSongsConfirm(props: DeleteSongsConfirmProps) {
    const { songs, openConfirm, onClick, onDelete } = props;
    const { fetchSongs } = useSongs();

    const handleClose = () => {
        onClick();
    };

    const deletemove = async () => {
        let len = songs.length;
        while (len > 0) {
            deleteSong(songs[len - 1].id)
            len--;
        }
    };
    
    const handleDelete = async () => {
        try {
            deletemove();
            onDelete();
            fetchSongs();
        } catch (error) {
            alert("Error: Failed to delete song");
        } finally {
            handleClose();
        }
      };

    return (
      <Dialog open={openConfirm} onClose={onClick}>
        
        <DialogTitle className="flex gap-4">
            Are you sure you want to delete?
        </DialogTitle>
  
        <DialogContent className="w-[600px] space-y-3">

            {/* Songs */}
            <Stack direction="column">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">

                        <TableHead>
                            <TableRow>
                                <TableCell> Song </TableCell>
                                <TableCell> Singer </TableCell>
                                <TableCell> Link </TableCell>
                                <TableCell> Edit </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                        {songs.map((song) => (
                            <>
                                <TableRow key={song.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <Song key={song.id} {...song} />
                                </TableRow>
                            </>
                        ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Stack>
  
            <DialogActions>
                <Button onClick={handleDelete}> Confirm </Button>
                <Button onClick={handleClose}> Cancel </Button>
            </DialogActions>
  
        </DialogContent>
        
      </Dialog>
    );
  }