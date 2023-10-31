import { Request, Response } from "express";
import express from "express";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { TextChannel } from "discord.js";
import { config } from "../utils/config";
import { Song } from "./Song";

export default class Server {
  public constructor(port: number) {
    const app = express();

    app.post("/stop", (req: Request, res: Response) => {
      const guildId = req.headers.guildid?.toString()!;
      const userId = req.headers.userid?.toString()!;
      const channelId = req.headers.channelid?.toString()!;
      const channel: TextChannel = <TextChannel>bot.client.channels.cache.get(channelId);
      const queue = bot.queues.get(guildId);
      const guildMemer = bot.client.guilds.cache.get(guildId)?.members.cache.get(userId);

      if (!queue) {
        res.status(404);
        res.send(i18n.__("stop.errorNotQueue"));
        return channel?.send(i18n.__("stop.errorNotQueue")).catch(console.error);
      }
      if (!guildMemer || !canModifyQueue(guildMemer)) {
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

      if (queue) {
        queue.enqueue(song);
        res.status(200);
        res.send(i18n.__mf("play.result", { title: song.title, author: userId }));
        return textChannel
          .send({ content: i18n.__mf("play.queueAdded", { title: song.title, author: userId }) })
          .catch(console.error);
      }

      res.status(500);
      res.send("Something went wrong somewhere, somehow");
    });

    app.listen(port, () => {
      console.log(`Server is running at ip http://${config.SERVER_IP}:${port}`);
    });
  }
}
