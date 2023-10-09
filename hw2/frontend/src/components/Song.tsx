import { useState } from "react";

import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
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

export default function Song({ id, song, singer, link, songlistId }: SongProps) {
  const [open, setOpen] = useState(false);
  const handleEditClick = () => {
    setOpen(true);
};

  return (
    <>
      <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

      <TableCell component="th" scope="row"> {song} </TableCell>

      <TableCell>{singer}</TableCell>

      <TableCell>
        <Link href={link} underline="hover" target='_blank' rel="noreferrer">
          {link}
        </Link>
      </TableCell>

      <TableCell>
        <IconButton onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
      </TableCell>


      </TableRow>

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
