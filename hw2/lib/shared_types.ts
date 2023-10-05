// The beauty of using TypeScript on both ends of the application is that we can
// share types between the client and the server very easily. This is a great way
// to keep the client and server in sync and avoid bugs. JavaScript makes you move
// fast, but TypeScript makes you move fast and not break things.

// A "type" can be defined with the `type` keyword or the `interface` keyword.
// They may seem similar, but there are some differences. For more information,
// see: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
// A general rule of thumb is to always use `type` unless you have a good reason
// to use `interface`. `interface` is more powerful, at the cost of baring more
// footguns.


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


// Test create song list

export type CreateSongListPayload = Omit<SongListData, "id" | "songs">;

export type CreateSongListResponse = Pick<SongListData, "id">;