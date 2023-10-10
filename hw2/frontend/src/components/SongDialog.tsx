import { useState } from "react";

import { Delete as DeleteIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs";
import { createSong, deleteSong } from "@/utils/client";

type NewSongDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  songlistId: string;
};

type EditSongDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  songlistId: string;
  songId: string;
  song: string;
  singer: string;
  link: string;
};

type SongDialogProps = NewSongDialogProps | EditSongDialogProps;

export default function SongDialog(props: SongDialogProps) {
  const { variant, open, onClose, songlistId } = props;
  const song = variant === "edit" ? props.song : "";
  const singer = variant === "edit" ? props.singer : "";
  const link = variant === "edit" ? props.link : "";
  const songId = variant === "edit" ? props.songId : "";

  const [edittingSong, setEdittingSong] = useState(variant === "new");
  const [edittingSinger, setEdittingSinger] = useState(variant === "new");
  const [edittingLink, setEdittingLink] = useState(variant === "new");

  const [newSong, setNewSong] = useState(song);
  const [newSinger, setNewSinger] = useState(singer);
  const [newLink, setNewLink] = useState(link);
  const [newSongListId, setNewSongListId] = useState(songlistId);

  const { songlists, fetchSongs } = useSongs();

  const handleClose = () => {
    onClose();
  };

  const handleSave = async () => {
    try {
      if (variant === "new") {
        await createSong({
          song: newSong,
          singer: newSinger,
          link: newLink,
          song_list_id: songlistId,
        });
      } 
      else {
        if (
          newSong === song &&
          newSinger === singer &&
          newLink === link &&
          newSongListId === songlistId
        ) {return;}
        else{
          await deleteSong(songId);
          await createSong({
            song: newSong,
            singer: newSinger,
            link: newLink,
            song_list_id: songlistId,
          });
          fetchSongs();
        }
      }
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to save song");
    } finally {
      handleClose();
    }
  };

  const handleDelete = async () => {
    if (variant !== "edit") {
      return;
    }
    try {
      await deleteSong(props.songId);
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to delete song");
    } finally {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      
      <DialogTitle className="flex gap-4">
        {edittingSong ? (
          <ClickAwayListener onClickAway={() => { if (variant === "edit") {setEdittingSong(false);}}}>
            <Input
              autoFocus
              defaultValue={song}
              onChange={(e) => setNewSong(e.target.value)}
              className="grow"
              placeholder="Enter song name"
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingSong(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newSong}</Typography>
          </button>
        )}
        
        <Select
          value={newSongListId}
          onChange={(e) => setNewSongListId(e.target.value)}
        >
          {songlists.map((songlist) => (
            <MenuItem value={songlist.id} key={songlist.id}>
              {songlist.name}
            </MenuItem>
          ))}
        </Select>
        
        {variant === "edit" && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent className="w-[600px] space-y-3">
        {edittingSinger ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingSinger(false);
              }
            }}
          >
            <Input
              className="w-full rounded-md p-2 hover:bg-white/10"
              autoFocus
              defaultValue={singer}
              placeholder="Add a singer"
              onChange={(e) => setNewSinger(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingSinger(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newSinger}</Typography>
          </button>
        )}
        {edittingLink ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingLink(false);
              }
            }}
          >
            <Input
              className="w-full rounded-md p-2 hover:bg-white/10"
              autoFocus
              defaultValue={link}
              placeholder="Add a youtube link"
              onChange={(e) => setNewLink(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingLink(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newLink}</Typography>
          </button>
        )}

        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>

      </DialogContent>
      
    </Dialog>
  );
}