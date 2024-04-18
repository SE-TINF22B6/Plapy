import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./structs/Bot";
import Server from "./structs/Server";
import { createConnection, getManager } from "typeorm";
import { SavedPlaylist } from "./structs/SavedPlaylist";

export const bot = new Bot(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages
    ]
  })
);
export const server = new Server(3000);
