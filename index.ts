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

async function fetchPlaylists() {
  const playlistRepository = getManager().getRepository(SavedPlaylist);
  let savedPlaylistsFromDb = await playlistRepository.find();
  for (const playlist of savedPlaylistsFromDb) {
    bot.savedPlaylists.set(playlist.id.toString(), playlist);
  }
}
