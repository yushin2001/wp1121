import IconButton from "@mui/material/IconButton";
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';

import useSongs from "@/hooks/useSongs";
import { deleteSongList } from "@/utils/client";

export type DeleteSongListProps = {
    songlistId: string;
    open: boolean;
    children?: React.ReactNode;
  };

export default function DeleteSongList(props: DeleteSongListProps) {
    const { songlistId, open } = props;
    const { fetchSongLists } = useSongs();

    const handleDelete = async () => {
        try {
          await deleteSongList(songlistId);
          fetchSongLists();
        } catch (error) {
          alert("Error: Failed to delete songlist");
        }
      };
    
    if (!open) return (
        <></>
    );

    return (
        <IconButton color="error" onClick={handleDelete}> 
          <HighlightOffSharpIcon/>
        </IconButton>
    );
  }