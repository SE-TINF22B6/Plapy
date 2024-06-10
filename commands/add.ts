import {
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
  MessageReaction,
  SlashCommandBuilder,
  TextChannel,
  User
} from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { SavedPlaylist } from "../structs/SavedPlaylist";
import { Song } from "../structs/Song";

export default {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription(i18n.__("addToPlaylist.description"))
    .addStringOption((option) =>
      option.setName("playlist").setDescription(i18n.__("addToPlaylist.descriptionOption")).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("song").setDescription(i18n.__("addToPlaylist.songOption")).setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const songInput = interaction.options.getString("song");
    let savedPlaylist = await SavedPlaylist.getOrSaveNewPlaylist("" + interaction.options.getString("playlist"), interaction.guildId!);

    if (songInput) {
      let song = await Song.from(songInput);
      await savedPlaylist.saveNewSong(song);
    }
    if (queue ) {
      let song = queue.songs.at(0);

      await savedPlaylist.saveNewSong(song!);
    }

    let currentPage = 0;
    const embeds = generateQueueEmbed(interaction, savedPlaylist.songs, savedPlaylist.title);

    await interaction.reply("⏳ Loading playlist...");

    if (interaction.replied)
      await interaction.editReply({
        content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
        embeds: [embeds[currentPage]]
      });

    const queueEmbed = await interaction.fetchReply();

    try {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("➡️");
    } catch (error: any) {
      console.error(error);
      (interaction.channel as TextChannel).send(error.message).catch(console.error);
    }

    const filter = (reaction: MessageReaction, user: User) =>
      ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name!) && interaction.user.id === user.id;

    const collector = queueEmbed.createReactionCollector({ filter, time: 60000 });

    collector.on("collect", async (reaction, user) => {
      try {
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit({
              content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
              embeds: [embeds[currentPage]]
            });
          }
        } else if (reaction.emoji.name === "⬅️") {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit({
              content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
              embeds: [embeds[currentPage]]
            });
          }
        } else {
          collector.stop();
          reaction.message.reactions.removeAll();
        }
        await reaction.users.remove(interaction.user.id);
      } catch (error: any) {
        console.error(error);
        return (interaction.channel as TextChannel).send(error.message).catch(console.error);
      }
    });
  }
};

function generateQueueEmbed(interaction: CommandInteraction, songs: Song[], title: string) {
  let embeds = [];
  let k = 10;

  for (let i = 0; i < songs.length; i += 10) {
    const current = songs.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Playlist: " + title)
      .setThumbnail(interaction.guild?.iconURL()!)
      .setColor("#2af8d2")
      .setDescription(i18n.__mf("addToPlaylist.embedPlaylist", { info: info }))
      .setTimestamp();
    embeds.push(embed);
  }

  return embeds;
}
