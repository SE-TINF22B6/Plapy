import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./structs/Bot";
import Server from "./structs/Server";

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
