import youtube, { Playlist as YoutubePlaylist } from "youtube-sr";
import { config } from "../utils/config";
import { Song } from "./Song";
import { scRegex } from "../utils/patterns";
import sc, { SoundCloud, SoundCloudPlaylist, SoundCloudTrack } from "play-dl";
const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/i;
export class Playlist {
  name: string;
  url: string
  public data: YoutubePlaylist | SoundCloudPlaylist;
  public songs: Song[];

  private constructor(){
  }

  public static async from(url: string = "", search: string = "") {
    const urlValid = pattern.test(url);
    const isSoundcloud = scRegex.test(url);
    let playlist;

    if (isSoundcloud) {
      await sc.getFreeClientID().then((clientID: string) => {
        sc.setToken({
          soundcloud: {
            client_id: clientID
          }
        })
      })
      playlist = await sc.soundcloud(url);
      if (playlist instanceof SoundCloudPlaylist)
        await playlist.fetch()
      let result = new Playlist();
      await result.soundCloudFactory(playlist);
      return result;

    }
    else if (urlValid) {
      playlist = await youtube.getPlaylist(url);

    } else {
      const result = await youtube.searchOne(search, "playlist");

      playlist = await youtube.getPlaylist(result.url!);
    }

    let result: Playlist = new Playlist();
    result.youTubeFactory(playlist);
    return result;
  }

  private youTubeFactory(playlist: YoutubePlaylist) {
    this.data = playlist;
    this.name = playlist.title ?? "";
    this.url = playlist.url ?? "";

    this.songs = this.data.videos
      .filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .slice(0, config.MAX_PLAYLIST_SIZE - 1)
      .map((video) => {
        return new Song({
          title: video.title!,
          url: `https://youtube.com/watch?v=${video.id}`,
          duration: video.duration / 1000
        });
      });
  }

  private async soundCloudFactory(playlist: SoundCloud) {
    if (playlist instanceof SoundCloudPlaylist) {
      this.name = playlist.name;
      this.url = playlist.url
      this.data = playlist
    }
    if (playlist instanceof SoundCloudPlaylist) {
        this.songs = playlist.tracks
          .slice(0, config.MAX_PLAYLIST_SIZE - 1)
          .map((song) => {
            if (song instanceof SoundCloudTrack) {
              return new Song({
                title: song.name!,
                url: song.permalink,
                duration: song.durationInSec
              })
            } else {
              return new Song({
                title: song.id.toString()!,
                url: `https://api-v2.soundcloud.com/resolve?url=${song.id}`,
                duration: 10
              })
            }
          })

    }
  }
}

