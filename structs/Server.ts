import { Request, Response } from "express";
import express from "express";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { EmbedBuilder, TextChannel } from "discord.js";
import { config } from "../utils/config";
import { Song } from "./Song";
import WebSocket from "ws";
import { playlistPattern } from "../utils/patterns";
import { Playlist } from "./Playlist";
import { MusicQueue } from "./MusicQueue";
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { authenticateApiKey } from "./AuthenticateApiKey";

export default class Server {
  // Explicitly declare the type of clients
  clients: { [serverId: string]: WebSocket[] } = {};

  public constructor(port: number) {
    const app = express();
    app.use(express.json());

    const wss = new WebSocket.Server({ port: 3010 });

    wss.on("connection", (ws) => {
      ws.on("message", (message) => {
        // Explicitly declare the type of serverId
        const serverId: string = message.toString();
        if (!this.clients[serverId]) {
          this.clients[serverId] = [];
        }
        this.clients[serverId].push(ws);
      });

      ws.on("close", () => {
        // Remove this WebSocket from the clients object
        for (let serverId in this.clients) {
          this.clients[serverId] = this.clients[serverId].filter(client => client !== ws);
        }
      });
    });

    app.use(authenticateApiKey);

    app.post("/stop", async (req: Request, res: Response) => {
      const guildId = req.headers.guildid?.toString()!;
      const userId = req.headers.userid?.toString()!;
      const channelId = req.headers.channelid?.toString()!;
      const channel: TextChannel = <TextChannel>bot.client.channels.cache.get(channelId);
      const queue = bot.queues.get(guildId);
      const guildMember = bot.client.guilds.cache.get(guildId)?.members.cache.get(userId);

      if (!queue) {
        res.status(404);
        res.send(i18n.__("stop.errorNotQueue"));
        return channel?.send(i18n.__("stop.errorNotQueue")).catch(console.error);
      }
      if (!guildMember || !canModifyQueue(guildMember)) {
        res.status(404);
        res.send(i18n.__("common.errorNotChannel"));
        return i18n.__("common.errorNotChannel");
      }

      queue.stop();

      channel?.send({ content: i18n.__mf("stop.result", { author: userId }) }).catch(console.error);

      res.status(200);
      res.send(i18n.__mf("stop.result", { author: userId }));
    });

    app.post("/skip", (req: Request, res: Response) => {
      let guildId = req.headers.guildid?.toString()!;
      let userId = req.headers.userid?.toString()!;
      let channelId = req.headers.channelid?.toString()!;
      const channel: TextChannel = <TextChannel>bot.client.channels.cache.get(channelId);
      const queue = bot.queues.get(guildId);
      const guildMemer = bot.client.guilds.cache.get(guildId)?.members.cache.get(userId);

      if (!queue) {
        res.status(404);
        res.send(i18n.__("skip.errorNotChannel"));
        return channel.send(i18n.__("skip.errorNotQueue")).catch(console.error);
      }

      if (!canModifyQueue(guildMemer!)) {
        res.status(404);
        res.send(i18n.__("common.errorNotChannel"));
        return i18n.__("common.errorNotChannel");
      }

      queue.player.stop(true);

      channel.send({ content: i18n.__mf("skip.result", { author: userId }) }).catch(console.error);
      res.status(200);
      res.send(i18n.__mf("skip.result", { author: userId }));
    });

    app.post("/volume", (req: Request, res: Response) => {
      const guildId = req.headers.guildid?.toString()!;
      const userId = req.headers.userid?.toString()!;
      const channelId = req.headers.channelid?.toString()!;
      const volumeArg = Number.parseInt(req.headers.volume?.toString()!);
      const channel: TextChannel = <TextChannel>bot.client.channels.cache.get(channelId);
      const queue = bot.queues.get(guildId);
      const guildMemer = bot.client.guilds.cache.get(guildId)?.members.cache.get(userId);

      if (!queue) return channel.send({ content: i18n.__("volume.errorNotQueue") }).catch(console.error);

      if (!canModifyQueue(guildMemer!))
        return channel.send({ content: i18n.__("volume.errorNotChannel") }).catch(console.error);

      if (!volumeArg || volumeArg === queue.volume)
        return channel
          .send({ content: i18n.__mf("volume.currentVolume", { volume: queue.volume }) })
          .catch(console.error);

      if (isNaN(volumeArg)) return channel.send({ content: i18n.__("volume.errorNotNumber") }).catch(console.error);

      if (Number(volumeArg) > 100 || Number(volumeArg) < 0)
        return channel.send({ content: i18n.__("volume.errorNotValid") }).catch(console.error);

      queue.volume = volumeArg;
      queue.resource.volume?.setVolumeLogarithmic(volumeArg / 100);
      res.status(200);
      res.send(i18n.__mf("volume.result", { arg: volumeArg }));

      return channel.send({ content: i18n.__mf("volume.result", { arg: volumeArg }) }).catch(console.error);
    });

    app.post("/play", async (req: Request, res: Response) => {
      const guildId = req.headers.guildid?.toString()!;
      const userId = req.headers.userid?.toString()!;
      const channelId = req.headers.channelid?.toString()!;
      const textChannel = <TextChannel>bot.client.channels.cache.get(channelId);
      let argSongName = req.headers.song?.toString()!;
      const queue = bot.queues.get(guildId);
      const guildMember = bot.client.guilds.cache.get(guildId)?.members.cache.get(userId);
      const { channel } = guildMember!.voice;
      let playlist = false;

      if (playlistPattern.test(argSongName)) {
        playlist = true;
      }

      if (!channel) return textChannel.send({ content: i18n.__("play.errorNotChannel") }).catch(console.error);

      if (queue && channel.id !== queue.connection.joinConfig.channelId)
        return textChannel
          .send({
            content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username })
          })
          .catch(console.error);

      if (!argSongName)
        return textChannel.send({ content: i18n.__mf("play.usageReply", { prefix: bot.prefix }) }).catch(console.error);

      const url = argSongName;

      if (!playlist) {

        let song = new Song({ title: "", url: "", duration: 0 });


        try {
          song = await Song.from(url, url);
        } catch (error: any) {
          console.error(error);

          if (error.name == "NoResults")
            return textChannel
              .send({ content: i18n.__mf("play.errorNoResults", { url: `<${url}>` }) })
              .catch(console.error);

          if (error.name == "InvalidURL")
            return textChannel
              .send({ content: i18n.__mf("play.errorInvalidURL", { url: `<${url}>` }) })
              .catch(console.error);
        }

        if (!queue) {
          const interaction = bot.permanentQueues.get(guildId);
          if (interaction) {
            const newQueue = new MusicQueue({
              interaction,
              textChannel: interaction.channel! as TextChannel,
              connection: joinVoiceChannel({
                channelId: interaction.guild!.members.cache.get(interaction.user.id)?.voice!.channel!.id!,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
              })
            });
            newQueue.enqueue(song);
            bot.queues.set(interaction.guild!.id, newQueue);
            res.status(200);
            res.send(i18n.__mf("play.result", { title: song.title, author: userId }));
            return textChannel
              .send({ content: i18n.__mf("play.queueAdded", { title: song.title, author: userId }) })
              .catch(console.error);
          } else {
            res.status(404);
            res.send("Please create a permanent queue first using /createpermanentqueue.");
          }
        } else {
          queue.enqueue(song);
          res.status(200);
          res.send(i18n.__mf("play.queueAdded", { title: song.title, author: userId }));
          return textChannel
            .send({ content: i18n.__mf("play.queueAdded", { title: song.title, author: userId }) })
            .catch(console.error);
        }

        res.status(500);
        res.send("Something went wrong somewhere, somehow");
      } else {
        let playlist;

        try {
          playlist = await Playlist.from(argSongName!.split(" ")[0], argSongName!);

        } catch (error) {
          console.error(error);
          res.status(500);
          res.send("Something went wrong somewhere, somehow");
          return;
        }

        if (!queue) {
          const interaction = bot.permanentQueues.get(guildId);
          if (interaction) {
            const newQueue = new MusicQueue({
              interaction,
              textChannel: interaction.channel! as TextChannel,
              connection: joinVoiceChannel({
                channelId: interaction.guild!.members.cache.get(interaction.user.id)?.voice!.channel!.id!,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
              })
            });
            bot.queues.set(interaction.guild!.id, newQueue);
            newQueue.enqueue(playlist.songs[0]);
            if (newQueue.songs.length > 1) {
              playlist.songs.shift();
              newQueue.songs.push(...playlist.songs);
            }
            let playlistEmbed = new EmbedBuilder()
              .setTitle(`${playlist.name}`)
              .setDescription(
                playlist.songs
                  .map((song: Song, index: number) => `${index + 1}. ${song.title}`)
                  .join("\n")
                  .slice(0, 4095)
              )
              .setURL(playlist.url!)
              .setColor("#F8AA2A")
              .setTimestamp();
            res.status(200);
            res.send(i18n.__mf("playlist.startedPlaylist", { author: userId }));
            return textChannel
              .send({
                content: i18n.__mf("playlist.startedPlaylist", { author: userId }),
                embeds: [playlistEmbed]
              })
              .catch(console.error);
          } else {
            res.status(404);
            res.send("Please create a permanent queue first using /createpermanentqueue.");
            return textChannel
              .send({ content: "<@" + userId + ">" + " Please create a permanent queue first using /createpermanentqueue." })
              .catch(console.error);
          }
        } else {
          queue.enqueue(playlist.songs[0]);
          if (queue.songs.length > 1) {
            playlist.songs.shift();
            queue.songs.push(...playlist.songs);
          }
          let playlistEmbed = new EmbedBuilder()
            .setTitle(`${playlist.name}`)
            .setDescription(
              playlist.songs
                .map((song: Song, index: number) => `${index + 1}. ${song.title}`)
                .join("\n")
                .slice(0, 4095)
            )
            .setURL(playlist.url!)
            .setColor("#F8AA2A")
            .setTimestamp();
          res.status(200);
          res.send(i18n.__mf("playlist.startedPlaylist", { author: userId }));
          return textChannel
            .send({
              content: i18n.__mf("playlist.startedPlaylist", { author: userId }),
              embeds: [playlistEmbed]
            })
            .catch(console.error);
        }
      }
    });

    app.get("/now-playing/:serverId", (req: Request, res: Response) => {
      const serverId = req.params.serverId;
      const queue = bot.queues.get(serverId);
      if (!queue) {
        res.status(404);
        res.send("Queue not found");
        return;
      }
      res.status(200);
      return res.json(queue.songs[0]);
    });

    app.listen(port, () => {
      console.log(`Server is running at ip http://${config.SERVER_IP}:${port}`);
    });
  }

  //notify all websocket clients of the song change
  notifySongChange(serverId: string, song: any) {
    const message = JSON.stringify(song);
    if (this.clients[serverId]) {
      this.clients[serverId].forEach(client => client.send(message));
    }
  }
}
