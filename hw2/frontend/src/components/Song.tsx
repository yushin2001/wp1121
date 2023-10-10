import { useState } from "react";

import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import SongDialog from "./SongDialog";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";

export type SongProps = {
  id: string;
  song: string;
  singer: string;
  link: string;
  songlistId: string;
};

export default function Song({ id, song, singer, link, songlistId}: SongProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableCell component="th" scope="row"> {song} </TableCell>

      <TableCell>{singer}</TableCell>

      <TableCell>
        <Link href={link} underline="hover" target='_blank' rel="noreferrer">
          {link}
        </Link>
      </TableCell>

      <TableCell>
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
      </TableCell>

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