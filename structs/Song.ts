import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import youtube from "youtube-sr";
import { i18n } from "../utils/i18n";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { videoPattern, isURL, scRegex } from "../utils/patterns";
import { SavedPlaylist } from "./SavedPlaylist";

const { stream, video_basic_info } = require("play-dl");
const sc = require('play-dl')

export interface SongData {
  url: string;
  title: string;
  duration: number;
}

@Entity()
export class Song {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({type: 'text', name: "url"} )
  public readonly url: string = "";

  @Column({type: 'text', name: "name"})
  public readonly title: string = "";

  @Column({type: 'integer', name: "length"})
  public readonly duration: number = 0;

  @ManyToOne(() => SavedPlaylist, playlist => playlist.songs) // Define the many-to-one relationship
  public playlist: SavedPlaylist;

  public constructor(songData?: SongData) {
    if (songData) {
      this.url = songData.url;
      this.title = songData.title;
      this.duration = songData.duration;
    }
  }
  public static async from(url: string = "", search: string = "") {
    const isYoutubeUrl = videoPattern.test(url);
    const isSoundcloudUrl = scRegex.test(url);

    let songInfo;

    if (isYoutubeUrl) {
      songInfo = await video_basic_info(url);

      return new this({
        url: songInfo.video_details.url,
        title: songInfo.video_details.title,
        duration: parseInt(songInfo.video_details.durationInSec)
      });
    } else if(isSoundcloudUrl) {
      await sc.getFreeClientID().then((clientID: string) => {
        sc.setToken({
          soundcloud : {
            client_id : clientID
          }
        })
      })
      songInfo = await sc.soundcloud(url);

      return new this({
        url: songInfo.permalink,
        title: songInfo.name,
        duration: songInfo.durationInSec
      });

    } else {
      const result = await youtube.searchOne(search);

      result ? null : console.log(`No results found for ${search}`);

      if (!result) {
        let err = new Error(`No search results found for ${search}`);

        err.name = "NoResults";

        if (isURL.test(url)) err.name = "InvalidURL";

        throw err;
      }

      songInfo = await video_basic_info(`https://youtube.com/watch?v=${result.id}`);

      return new this({
        url: songInfo.video_details.url,
        title: songInfo.video_details.title,
        duration: parseInt(songInfo.video_details.durationInSec)
      });
    }
  }

  public async makeResource(): Promise<AudioResource<Song> | void> {
    let playStream;

    let type = this.url.includes("youtube.com") ? StreamType.Opus : StreamType.OggOpus;

    const source = this.url.includes("youtube") ? "youtube" : "soundcloud";

    if(source === "youtube") {
      playStream = await stream(this.url, {quality: 2, discordPlayerCompatibility: true});
    } else if (source === "soundcloud") {
      playStream = await sc.stream(this.url, {quality: 2, discordPlayerCompatibility: true});
    }



    if (!stream) return;

    return createAudioResource(playStream.stream, { metadata: this, inputType: playStream.type, inlineVolume: true });
  }

  public startMessage() {
    return i18n.__mf("play.startedPlaying", { title: this.title, url: this.url });
  }
}
