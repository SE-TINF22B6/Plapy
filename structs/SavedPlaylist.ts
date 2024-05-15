import {Column, Entity, getRepository, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Song } from "./Song";
import * as punycode from "punycode";

@Entity({name: "playlist"})
export class SavedPlaylist {
  @PrimaryGeneratedColumn({name: "id"})
  id: number;

  @ManyToMany(() => Song, { cascade: ['insert', 'update'] })
  @JoinTable()
  public songs: Song[];

  @Column({type : "text", name: "name"})
  public title: string = "";

  @Column({type : "text", name: "description"})
  description: string = "";

  @Column({type: "text" , name:"guild"})
  guildID: string;

  constructor(data?: Partial<PlaylistData>) {
    if (data) {
      if(data.songs) {
        this.songs = data.songs!;
      }
      this.title = data.title!;
      this.guildID = data.guildId!;
    }
  }


  public async saveNewSong(song: Song): Promise<Song> {
    if(!this.songs){
      this.songs = []
    }
    this.songs.push(song);
    this.save();
    return song;
  }

  public static async getOrSaveNewPlaylist(name: string, guildID: string):Promise<SavedPlaylist>{
    const playlistRepository = getRepository(SavedPlaylist);
    return await playlistRepository.findOne({
        where: { title: name , guildID: guildID},
        relations: ["songs"]
      }) ||
      await playlistRepository.save(new SavedPlaylist({
        songs: [],
        title: name,
        guildId: guildID
      }));
  }
  public async save() {
    await getRepository(SavedPlaylist).save(this);
  }
}




export interface PlaylistData {
  id: number;
  songs: Song[];
  title: string;
  description: string;
  guildId: string;
}
