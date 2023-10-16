import { PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { playlistPattern } from "../utils/patterns";
import { Song } from "../structs/Song";
import { MusicQueue } from "../structs/MusicQueue";
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";

export default {
  data: new SlashCommandBuilder()
    .setName("playnext")
    .setDescription("Play a song as the next one in the queue")
    .addStringOption((option) => option.setName("song").setDescription("The song you want to play").setRequired(true)),
  cooldown: 3,
  permissions: [
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.ManageMessages
  ],
  async execute(interaction: any, input: string) {
    let argSongName = interaction.options.getString("song");
    if (!argSongName) argSongName = input;

    const guildMember = interaction.guild!.members.cache.get(interaction.user.id);
    const { channel } = guildMember!.voice;

    if (!channel)
      return interaction.reply({ content: i18n.__("play.errorNotChannel"), ephemeral: true }).catch(console.error);

    const queue = bot.queues.get(interaction.guild!.id);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
      return interaction
        .reply({
          content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username }),
          ephemeral: true
        })
        .catch(console.error);

    if (!argSongName)
      return interaction
        .reply({ content: i18n.__mf("play.usageReply", { prefix: bot.prefix }), ephemeral: true })
        .catch(console.error);

    const url = argSongName;

    if (interaction.replied) await interaction.editReply("⏳ Loading...").catch(console.error);
    else await interaction.reply("⏳ Loading...");

    // Start the playlist if playlist url was provided
    if (playlistPattern.test(url)) {
      return interaction.editReply("playnext is not available for playlists 🫨").catch(console.error);
    }

    let song;

    try {
      song = await Song.from(url, url);
    } catch (error: any) {
      console.error(error);

      if (error.name == "NoResults")
        return interaction
          .reply({ content: i18n.__mf("play.errorNoResults", { url: `<${url}>` }), ephemeral: true })
          .catch(console.error);

      if (error.name == "InvalidURL")
        return interaction
          .reply({ content: i18n.__mf("play.errorInvalidURL", { url: `<${url}>` }), ephemeral: true })
          .catch(console.error);

      if (interaction.replied)
        return await interaction.editReply({ content: i18n.__("common.errorCommand") }).catch(console.error);
      else return interaction.reply({ content: i18n.__("common.errorCommand"), ephemeral: true }).catch(console.error);
    }

    if (queue) {
      queue.playNext(song);

      return (interaction.channel as TextChannel)
        .send({ content: i18n.__mf("play.queueAdded", { title: song.title, author: interaction.user.id }) })
        .catch(console.error);
    }

    const newQueue = new MusicQueue({
      interaction,
      textChannel: interaction.channel! as TextChannel,
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
    });

    bot.queues.set(interaction.guild!.id, newQueue);

    newQueue.enqueue(song);
    interaction.deleteReply().catch(console.error);
  }
};
