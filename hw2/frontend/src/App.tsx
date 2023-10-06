import { useEffect } from "react";

import SongList from "@/components/SongList";
import HeaderBar from "@/components/HeaderBar";
import MyPlaylist from "@/components/MyPlaylist";
import useSongs from "@/hooks/useSongs";

function App() {
  const { songlists, fetchSongLists, fetchSongs } = useSongs();

  useEffect(() => {
    fetchSongLists();
    fetchSongs();
  }, [fetchSongs, fetchSongLists]);

  return (
    <>
      <HeaderBar />
      <MyPlaylist />

      <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
        {songlists.map((songlist) => (
          <SongList key={songlist.id} {...songlist} />
        ))}
      </main>

    </>
  );
}

export default App;