import { useEffect, useState } from "react";

import { Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

import SongList from "@/components/SongList";
import HeaderBar from "@/components/HeaderBar";
import NewSongListDialog from "@/components/NewSongListDialog";
import useSongs from "@/hooks/useSongs";

function App() {
  const { songlists, fetchSongLists, fetchSongs } = useSongs();
  const [newSongListDialogOpen, setNewSongListDialogOpen] = useState(false);

  useEffect(() => {
    fetchSongLists();
    fetchSongs();
  }, [fetchSongs, fetchSongLists]);

  return (
    <>
      <HeaderBar />
      <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
        {songlists.map((songlist) => (
          <SongList key={songlist.id} {...songlist} />
        ))}

        <div>
          <Button variant="contained" className="w-80" onClick={() => setNewSongListDialogOpen(true)}>
            <AddIcon className="mr-2" />
            Add a songlist
          </Button>
        </div>

        <NewSongListDialog open={newSongListDialogOpen} onClose={() => setNewSongListDialogOpen(false)}/>
        
      </main>
    </>
  );
}

export default App;