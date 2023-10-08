import { useRef, useState} from "react";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs";
import { updateSongList } from "@/utils/client";
import type { SongProps } from "./Song";
import DeleteSongList from "./DeleteSongList";
import logo from './logo.jpeg';
import SongListContent from "./SongListContent";

export type SongListProps = {
  id: string;
  name: string;
  description: string;
  songs: SongProps[];
  opendelete: boolean;
};

export default function SongList({ id, name, description, songs, opendelete }: SongListProps) {
  const [edittingName, setEdittingName] = useState(false);
  const { fetchSongLists } = useSongs();
  const inputRef = useRef<HTMLInputElement>(null);
  const [openContent, setOpenContent] = useState(false);

  // image button
  const handleOpen = () => {
    if (openContent === false) setOpenContent(true);
    else setOpenContent(false);
  };
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

  return (
    <>
      {/* Entire list includes songs and add song button */}
      <Paper className="w-80 p-6">
        
      <DeleteSongList
        songlistId= {id}
        open= {opendelete}>
      </DeleteSongList>

        <div>
          <img src={logo} onClick={handleOpen} className='rounded-xl'/>
        </div>

        {/* List top section includes title */}
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
      </Paper>
      <SongListContent id={id} name={name} description={description} songs={songs} openContent={openContent} onClick={() => handleOpen()}/>
    </>
  );
}