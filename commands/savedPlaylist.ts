import {
  ActionRowBuilder,
  ChatInputCommandInteraction, EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  StringSelectMenuBuilder, StringSelectMenuInteraction, TextChannel
} from "discord.js";
import { i18n } from "../utils/i18n";
import { bot } from "../index";
import { SavedPlaylist } from "../structs/SavedPlaylist";
import { getRepository } from "typeorm";
import { Song } from "../structs/Song";
import { MusicQueue } from "../structs/MusicQueue";
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";

export default {
  data: new SlashCommandBuilder()
    .setName("savedplaylist")
    .setDescription(i18n.__("playlist.description"))
    .addStringOption((option) => option.setName("playlist").setDescription("Select a saved playlist by name directly").setRequired(false)),
  cooldown: 5,
  permissions: [
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.ManageMessages
  ],
  async execute(interaction: ChatInputCommandInteraction, queryOptionName = "playlist") {
    const member = interaction.guild!.members.cache.get(interaction.user.id);
    const guildID = interaction.guild!.id;
    const { channel } = member!.voice;

    if (!member?.voice.channel)
      return interaction.reply({ content: i18n.__("search.errorNotChannel"), ephemeral: true }).catch(console.error);

    await interaction.reply("⏳ Loading...").catch(console.error);

    let results: SavedPlaylist[] = [];

    // Define savedPlaylistRepository in a higher scope
    const savedPlaylistRepository = getRepository(SavedPlaylist);

    try {
      // Fetch the saved playlists for the guild from the database
      results = await savedPlaylistRepository.find({ where: { guildID: guildID } });
    } catch (error: any) {
      console.error(error);
      interaction.editReply({ content: i18n.__("common.errorCommand") }).catch(console.error);
      return;
    }

    if (!results || !results[0]) {
      interaction.editReply({ content: i18n.__("search.noResults") });
      return;
    }

    const options = results!.map((playlist) => {
      return {
        label: playlist.title ?? "",
        value: playlist.title // Pad the id with leading zeros
      };
    });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("search-select")
        .setPlaceholder("Nothing selected")
        .addOptions(options)
    );

    const followUp = await interaction.followUp({
      content: "Choose a playlist to play",
      components: [row]
    });

    followUp
      .awaitMessageComponent({
        time: 30000
      })
      .then((selectInteraction) => {
        if (!(selectInteraction instanceof StringSelectMenuInteraction)) return;
        selectInteraction.update({ content: "⏳ Loading the selected playlist...", components: [] });

        // Fetch the selected playlist from the database
        savedPlaylistRepository.findOne({
          where: { title: selectInteraction.values[0], guildID: guildID },
          relations: ["songs"]
        })
          .then((playlist) => {
            if (!playlist) {
              return interaction.editReply({ content: i18n.__("search.noResults") });
            }
            let queue = bot.queues.get(guildID);
            if (!queue) {
              queue = new MusicQueue({
                interaction,
                textChannel: interaction.channel! as TextChannel,
                connection: joinVoiceChannel({
                  channelId: channel!.id,
                  guildId: channel!.guild.id,
                  adapterCreator: channel!.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
                })
              });
              bot.queues.set(guildID, queue);
            }
            bot.queues.get(guildID)?.enqueue(...playlist!.songs);
            let playlistEmbed = new EmbedBuilder()
              .setTitle(`${playlist!.title}`)
              .setDescription(
                playlist!.songs
                  .map((song: Song, index: number) => `${index + 1}. ${song.title}`)
                  .join("\n")
                  .slice(0, 4095)
              )
              .setColor("#F8AA2A")
              .setTimestamp();
            selectInteraction.deleteReply();

            if (interaction.replied)
              return interaction.editReply({
                content: i18n.__mf("playlist.startedPlaylist", { author: interaction.user.id }),
                embeds: [playlistEmbed]
              });
            interaction
              .reply({
                content: i18n.__mf("playlist.startedPlaylist", { author: interaction.user.id }),
                embeds: [playlistEmbed]
              })
              .catch(console.error);

          })
          .catch(console.error);
      })
      .catch(console.error);
  }
};