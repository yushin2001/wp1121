import { useState } from "react";
import { useEffect } from "react";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from "@mui/material/Toolbar";

import SongList from "@/components/SongList";
import NewSongListDialog from "@/components/NewSongListDialog";
import useSongs from "@/hooks/useSongs";
import DeleteSongList from "./DeleteSongList";

export type MyPlaylistProps = {
    children?: React.ReactNode;
  };

export default function MyPlaylist(_: MyPlaylistProps) {
    const [newSongListDialogOpen, setNewSongListDialogOpen] = useState(false);
    const [buttonText, setButtonText] = useState('DELETE');
    const [opendelete, setOpendelete] = useState(false);
    const { songlists, fetchSongLists, fetchSongs } = useSongs();

    // When click "DELETE", the button change to "DONE" and show delete button
    function handleClick() {
        if (buttonText === 'DELETE'){
            setButtonText('DONE');
            setOpendelete(true);
        }
        else{
            setButtonText('DELETE');
            setOpendelete(false);
        }
    }

    useEffect(() => {
        fetchSongLists();
        fetchSongs();
      }, [fetchSongs, fetchSongLists]);

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
                <Button variant="contained" color="success" onClick={() => handleClick()}> {buttonText} </Button>
            </Stack>
        </Toolbar>
        <div className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
            {songlists.map((songlist) => (
                <SongList key={songlist.id} {...songlist}>
                    <DeleteSongList songlistId= {songlist.id} open={opendelete}/>
                </SongList>
            ))}
        </div>
        <NewSongListDialog open={newSongListDialogOpen} onClose={() => setNewSongListDialogOpen(false)}/>
        </>
);
}

