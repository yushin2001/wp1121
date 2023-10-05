// 歌曲本身，包含編輯（新增、刪除、更新）

import { useState } from "react";

import { Paper } from "@mui/material";

import SongDialog from "./SongDialog";

export type SongProps = {
  id: string;
  song: string;
  singer: string;
  link: string;
  songlistId: string;
};

export default function Song({ id, song, singer, link, songlistId }: SongProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <button onClick={handleClickOpen} className="text-start">
        <Paper className="flex w-full flex-col p-2" elevation={6}>
          {song}
        </Paper>
      </button>
      <SongDialog
        variant="edit"
        open={open}
        onClose={() => setOpen(false)}
        song={song}
        singer={singer}
        link={link}
        songlistId={songlistId}
        songId={id}
      />
    </>
  );
}