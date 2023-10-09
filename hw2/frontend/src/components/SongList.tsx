import { useState} from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import type { SongProps } from "./Song";
import logo from './logo.jpeg';
import SongListContent from "./SongListContent";

export type SongListProps = {
  id: string;
  name: string;
  description: string;
  songs: SongProps[];
  children?: React.ReactNode;
};

export default function SongList({ id, name, description, songs, children }: SongListProps) {
  const [openContent, setOpenContent] = useState(false);

  // image button
  const handleOpen = () => {
    if (openContent === false) setOpenContent(true);
    else setOpenContent(false);
  };

  return (
    <>
      {/* Entire list includes songs and add song button */}
      <Paper className="w-80 p-6">
        
        {children}

        <div>
          <img src={logo} onClick={handleOpen} className='rounded-xl'/>
        </div>

        {/* List top section includes title */}
        <div className="pt-2">
          <Typography className="text-start" variant="h5" sx={{ mt: 0.5}}>
            {name}
          </Typography>
        </div>
      </Paper>
      <SongListContent id={id} name={name} description={description} songs={songs} openContent={openContent} onClick={() => handleOpen()}/>
    </>
  );
}