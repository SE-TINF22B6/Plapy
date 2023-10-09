import { Request, Response } from "express";
import express from "express";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { TextChannel } from "discord.js";
import { config } from "../utils/config";

export default class Server {
  public constructor(port: number) {
    const app = express();

    app.post("/stop", (req: Request, res: Response) => {
      let guildId = req.headers.guildid?.toString()!;
      let userId = req.headers.userid?.toString()!;
      let channelId = req.headers.channelid?.toString()!;
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

    app.listen(port, () => {
      console.log(`Server is running at ip http://${config.SERVER_IP}:${port}`);
    });
  }
}
