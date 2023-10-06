import { Song } from "./Song";

export interface PlaylistData {
  songs: Song[];
  title: string;
  guildId: string;
}

export class SavedPlaylist {
  public songs: Song[];
  public title: string;
  public guildId: string;
  constructor({ songs, title, guildId }: PlaylistData) {
    this.songs = songs;
    this.title = title;
    this.guildId = guildId;
  }
}
