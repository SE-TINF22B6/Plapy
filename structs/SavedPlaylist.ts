import { Column, Entity, getRepository, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Song } from "./Song";

@Entity({name: "playlist"})
export class SavedPlaylist {
  @PrimaryGeneratedColumn({name: "id"})
  id: number;

  @OneToMany(() => Song, song => song.playlist, {
    cascade: ['insert', 'update']

  }) // Define the one-to-many relationship
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


  public async saveNewSong(song: Song): Promise<Song> {
    const songRepository = getRepository(Song);
    song.playlist = this;
    await songRepository.save(song); // This saves the song to the database
    if(!this.songs){
      this.songs = []
    }
    this.songs.push(song);
    return song;
  }

  public static async getOrSaveNewPlaylist(name: string):Promise<SavedPlaylist>{
    const playlistRepository = getRepository(SavedPlaylist);
    return await playlistRepository.findOne({
        where: { title: name },
        relations: ["songs"]
      }) ||
      await playlistRepository.save(new SavedPlaylist({
        songs: [],
        title: name
      }));
}
}



export interface PlaylistData {
  id: number;
  songs: Song[];
  title: string;
  description: string;
}
