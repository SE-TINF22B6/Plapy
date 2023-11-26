import { Song } from "./Song";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";

@Entity({name: "playlist"})
export class SavedPlaylist {
  @PrimaryGeneratedColumn({name: "id"})
  id: number;

  @ManyToMany(() => Song)
  @JoinTable({name: "playlist_songs"})
  public songs: Song[];

  @Column({type : "text", name: "name"})
  public title: string = "";

  @Column({type : "text", name: "description"})
  description: string = "";

  constructor(data?: Partial<PlaylistData>) {
    if (data) {
      if(data.songs) {
        this.songs = data.songs!;
      }
      this.title = data.title!;
    }
  }
}

export interface PlaylistData {
  id: number;
  songs: Song[];
  title: string;
  description: string;
}
