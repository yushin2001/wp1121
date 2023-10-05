import type {
  CreateSongPayload,
  CreateSongResponse,
  CreateSongListPayload,
  CreateSongListResponse,
  GetSongsResponse,
  GetSongListsResponse,
  UpdateSongPayload,
  UpdateSongResponse,
  DeleteSongResponse,
  DeleteSongListResponse,
  UpdateSongListPayload,
  UpdateSongListResponse,
} from "@lib/shared_types";
import axios from "axios";

import { env } from "./env";

const client = axios.create({
  baseURL: env.VITE_API_URL,
});

export function getSongLists() {
  return client.get<GetSongListsResponse>("/songlists");
}

export function getSongs() {
  return client.get<GetSongsResponse>("/songs");
}

export function createSongList(input: CreateSongListPayload) {
  return client.post<CreateSongListResponse>("/songlists", input);
}

export function createSong(input: CreateSongPayload) {
  return client.post<CreateSongResponse>("/songs", input);
}

export function updateSong(id: string, input: UpdateSongPayload) {
  return client.put<UpdateSongResponse>(`/songs/${id}`, input);
}

export function updateSongList(id: string, input: UpdateSongListPayload) {
  return client.put<UpdateSongListResponse>(`/songlists/${id}`, input);
}

export function deleteSong(id: string) {
  return client.delete<DeleteSongResponse>(`/songs/${id}`);
}

export function deleteSongList(id: string) {
  return client.delete<DeleteSongListResponse>(`/songlists/${id}`);
}