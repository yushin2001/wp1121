// 歌單編輯（刪除、更新）

import { useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs";
import { deleteSongList, updateSongList } from "@/utils/client";

import Song from "./Song";
import type { SongProps } from "./Song";
import SongDialog from "./SongDialog";
import logo from './logo.jpeg';

export type SongListProps = {
    id: string;
    name: string;
    songs: SongProps[];
  };

export default function SongList({ id, name, songs }: SongListProps) {
  const [openNewSongDialog, setOpenNewSongDialog] = useState(false);
  const [edittingName, setEdittingName] = useState(false);
  const { fetchSongLists } = useSongs();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateName = async () => {
    if (!inputRef.current) return;

    const newName = inputRef.current.value;
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

  const handleDelete = async () => {
    try {
      await deleteSongList(id);
      fetchSongLists();
    } catch (error) {
      alert("Error: Failed to delete songlist");
    }
  };

  return (
    <>

      {/* Entire list includes songs and add song button */}
      <Paper className="w-80 p-6">
        
        <IconButton color="error" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>

        <img src={logo} />

        {/* List top section includes title and delete button */}
        <div className="flex gap-4">
          {edittingName ? (
            <ClickAwayListener onClickAway={handleUpdateName}>
              <Input
                autoFocus
                defaultValue={name}
                className="grow"
                placeholder="Enter a new name for this songlist..."
                sx={{ fontSize: "2rem" }}
                inputRef={inputRef}
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

        <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />

        {/* Songs */}
        <div className="flex flex-col gap-4">
          {songs.map((song) => (
            <Song key={song.id} {...song} />
          ))}

          {/* Add songs */}
          <Button variant="contained" onClick={() => setOpenNewSongDialog(true)}>
            <AddIcon className="mr-2" />
            Add a song
          </Button>
        </div>

      </Paper>

      <SongDialog
        variant="new"
        open={openNewSongDialog}
        onClose={() => setOpenNewSongDialog(false)}
        songlistId={id}
      />
    </>
  );
}