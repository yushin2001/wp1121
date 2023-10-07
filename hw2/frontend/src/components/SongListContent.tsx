import * as React from 'react';
import { useRef, useState} from "react";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import Stack from '@mui/material/Stack';

import type { SongProps } from "./Song";
import Song from "./Song";
import useSongs from "@/hooks/useSongs";
import { updateSongList } from "@/utils/client";
import SongDialog from "./SongDialog";
import logo from './logo.jpeg';

export type SongListContentProps = {
    id: string;
    name: string;
    description: string;
    songs: SongProps[];
    openContent: boolean;
    onClick:  () => void;
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SongListContent({ id, name, description, songs, openContent, onClick }: SongListContentProps) {
    const [openNewSongDialog, setOpenNewSongDialog] = useState(false);
    const { fetchSongLists } = useSongs();
    const [edittingName, setEdittingName] = useState(false);
    const inputRefName = useRef<HTMLInputElement>(null);
    const [edittingDescription, setEdittingDescription] = useState(false);
    const inputRefDescription = useRef<HTMLInputElement>(null);

    const handleUpdateName = async () => {
        if (!inputRefName.current) return;
        const newName = inputRefName.current.value;
        if (newName !== name) {
          try {
            await updateSongList(id, { name: newName });
            fetchSongLists();
          } catch (error) {
            alert("Error: Failed to update songlist name");
          }
        }
        setEdittingName(false);
    };
    const handleUpdateDescription = async () => {
        if (!inputRefDescription.current) return;
        const newDescription = inputRefDescription.current.value;
        if (newDescription !== description) {
          try {
            await updateSongList(id, { description: newDescription });
            fetchSongLists();
          } catch (error) {
            alert("Error: Failed to update songlist description");
          }
        }
        setEdittingDescription(false);
    };

    return (
        <>  
            <Dialog
            fullScreen
            open={openContent}
            onClose={onClick}
            TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClick}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {/* Top: name, description, img */}
                <Stack direction="row" spacing={2}>
                    <img src={logo}/>
                    <div className="flex gap-4">
                        {edittingName ? (
                            <ClickAwayListener onClickAway={handleUpdateName}>
                            <Input
                                autoFocus
                                defaultValue={name}
                                className="grow"
                                placeholder="Enter a new name for this songlist..."
                                sx={{ fontSize: "1.5rem" }}
                                inputRef={inputRefName}
                            />
                            </ClickAwayListener>
                        ) : (
                            <button
                            onClick={() => setEdittingName(true)}
                            className="w-full rounded-md p-2 hover:bg-white/10"
                            >
                            <Typography className="text-start" variant="h5" sx={{ mt: 0.5}}>
                                {name}
                            </Typography>
                            </button>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {edittingDescription ? (
                            <ClickAwayListener onClickAway={handleUpdateDescription}>
                            <Input
                                autoFocus
                                defaultValue={description}
                                className="grow"
                                placeholder="Enter a new description for this songlist..."
                                sx={{ fontSize: "1.5rem" }}
                                inputRef={inputRefDescription}
                            />
                            </ClickAwayListener>
                        ) : (
                            <button
                            onClick={() => setEdittingDescription(true)}
                            className="w-full rounded-md p-2 hover:bg-white/10"
                            >
                            <Typography className="text-start" variant="h5" sx={{ mt: 0.5}}>
                                {description}
                            </Typography>
                            </button>
                        )}
                    </div>
                    {/* Add songs */}
                    <Button variant="contained" onClick={() => setOpenNewSongDialog(true)}>
                    <AddIcon className="mr-2" />
                    Add a song
                    </Button>
                </Stack>


                <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />


                {/* Songs */}
                <div className="flex flex-col gap-4">
                {songs.map((song) => (
                    <Song key={song.id} {...song} />
                ))}
                </div>

                <SongDialog
                variant="new"
                open={openNewSongDialog}
                onClose={() => setOpenNewSongDialog(false)}
                songlistId={id}
                />
            </Dialog>
        </>
    );
}