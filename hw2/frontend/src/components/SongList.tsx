import { useState} from "react";

import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';

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
  const [songcount, setSongcount] = useState(songs.length);
  const [countnumber, setCountnumber] = useState((songcount > 1)?true:false);

  const handleOpen = () => {
    if (openContent === false) setOpenContent(true);
    else {
      setOpenContent(false);
      setSongcount(songs.length);
      if (songcount > 1){
        setCountnumber(true);
      }
    }
  };

  return (
    <>
      {/* Entire list includes songs and add song button */}
      <Stack direction="column">
        <div>
          {children}
          <img src={logo} onClick={handleOpen} className='rounded-xl w-72 h-48'/>
        </div>
        <div className="pt-0.5">
          {countnumber ? (
          <div style={{color:'#93C5FD'}}> 
          {songcount} songs
          </div>
          ) : (
          <div style={{color:'#93C5FD'}}> 
          {songcount} song
          </div>
          )
          }
          <Typography className="text-start" variant="h6" sx={{ mt: 0.1 }}>
            {name}
          </Typography>
        </div>
      </Stack>
      <SongListContent id={id} name={name} description={description} songs={songs} openContent={openContent} onClick={() => handleOpen()}/>
    </>
  );
}