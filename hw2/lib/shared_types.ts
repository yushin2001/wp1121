// for WP Music
export type SongData ={
  id: string;
  song: string;
  singer: string;
  link: string;
  song_list_id: string;
}

export type SongListData = {
  id: string;
  name: string;
  description: string;
  songs: SongData[];
};

export type GetSongsResponse = SongData[];

export type GetSongResponse = SongData;

export type CreateSongPayload = Omit<SongData, "id">;

export type CreateSongResponse = Pick<SongData, "id">;

export type UpdateSongPayload = Partial<Omit<SongData, "id">>;

export type UpdateSongResponse = "OK";

export type DeleteSongResponse = "OK";

export type GetSongListsResponse = Omit<SongListData, "songs">[];

export type UpdateSongListPayload = Partial<Omit<SongListData, "id" | "songs">>;

export type UpdateSongListResponse = "OK";

export type DeleteSongListResponse = "OK";

export type CreateSongListPayload = Omit<SongListData, "id" | "songs">;

export type CreateSongListResponse = Pick<SongListData, "id">;