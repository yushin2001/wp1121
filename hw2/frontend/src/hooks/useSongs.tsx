import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
  } from "react";
  
import type { GetSongsResponse, GetSongListsResponse } from "@lib/shared_types";

import type { SongListProps } from "@/components/SongList";
import { getSongs, getSongLists } from "@/utils/client";

type SongContextType = {
  songlists: SongListProps[];
  fetchSongLists: () => Promise<void>;
  fetchSongs: () => Promise<void>;
};

const SongContext = createContext<SongContextType>({
  songlists: [],
  fetchSongLists: async () => {},
  fetchSongs: async () => {},
});

type SongProviderProps = {
  children: React.ReactNode;
};

// all data fetching and processing is done here, the rest of the app just consumes the data exposed by this provider
// when we run fetchSongLists or fetchSongs, we update the state of the provider, which causes the rest of the app to re-render accordingly
export function SongProvider({ children }: SongProviderProps) {
  const [rawSongLists, setRawSongLists] = useState<GetSongListsResponse>([]);
  const [rawSongs, setRawSongs] = useState<GetSongsResponse>([]);

  // set rawSongLists
  const fetchSongLists = useCallback(async () => {
    try {
      const { data } = await getSongLists();
      setRawSongLists(data);
    } catch (error) {
      alert("Error: failed to fetch songlists");
    }
  }, []);

  // set rawSongs
  const fetchSongs = useCallback(async () => {
    try {
      const { data } = await getSongs();
      setRawSongs(data);
    } catch (error) {
      alert("Error: failed to fetch songs");
    }
  }, []);

  // arrange rawSongLists and rawSongs
  const songlists = useMemo(() => {
    const songlistMap = rawSongLists.reduce(
      (acc, songlist) => {
        acc[songlist.id] = { ...songlist, songs: [] };
        return acc;
      },
      {} as Record<string, SongListProps>,
    );
    for (const song of rawSongs) {
      const songlist = songlistMap[song.song_list_id];
      if (!songlist) {
        continue;
      }
      songlistMap[song.song_list_id].songs.push({
        ...song,
        songlistId: song.song_list_id,
      });
    }
    return Object.values(songlistMap);
  }, [rawSongs, rawSongLists]);

  return (
    <SongContext.Provider
      value={{
        songlists,
        fetchSongLists,
        fetchSongs,
      }}
    >
      {children}
    </SongContext.Provider>
  );
}


// a custom hook
export default function useSongs() {
  return useContext(SongContext);
}