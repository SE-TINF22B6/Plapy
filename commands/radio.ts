import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueue";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { playlistPattern  } from "../utils/patterns";
import YouTube from "youtube-sr";

export default {
  data: new SlashCommandBuilder()
    .setName("radio")
    .setDescription(i18n.__("play.description"))
    .addStringOption((option) =>
      option.setName("song").setDescription("The song to base the radio on").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("songs").setDescription("Number of radio songs, up to a max of 25").setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName("mixes").setDescription("Exclude videos that are longer than 15min. Standard is true").setRequired(false))
    .addBooleanOption((option) =>
      option.setName("similar").setDescription("Exclude songs with a similar name. Standard is true").setRequired(false)),
  cooldown: 3,
  permissions: [
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.ManageMessages
  ],
  async execute(interaction: ChatInputCommandInteraction, input: string) {
    let argSongName = interaction.options.getString("song");
    if (!argSongName) argSongName = input;
    let excludeMixes = interaction.options.getBoolean("mixes") ?? true;
    let excludeSimilar = interaction.options.getBoolean("similar") ?? true;
    let failedAdds = 0;
    let addedSongTitles: String[] = []



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
      await interaction.editReply("🔗 Link is playlist").catch(console.error);

      return bot.slashCommandsMap.get("playlist")!.execute(interaction, "song");
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
      queue.enqueue(song);
      return await processRadio(song, queue);
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
    return await processRadio(song, newQueue);

    async function processRadio(song: Song, queue: MusicQueue) {
      extractSongTitle(song);
      let songyt = await YouTube.getVideo(song.url);
      let addedSongs = 0;
      let desiredSongs = Number.parseInt(interaction.options.getString("songs")!);
      if (desiredSongs > 25) {
        desiredSongs = 25;
        (interaction.channel as TextChannel)
          .send({ content: `Maximum allowed radio songs are 25` })
          .catch(console.error);
      }
      while (addedSongs < desiredSongs) {
        let lastSuccessfulAdd = 0;
        for (const { value, index } of songyt.videos!.map((value, index) => ({ index, value }))) {
          if (addedSongs == desiredSongs) break;
          if (failedAdds == 20) {
            return await interaction.channel?.send({content: `Aborted radio because 20 songs failed to add due to duration and similar song settings`})
          }
          let song = await Song.from(value.url)
          if(excludeMixes && song.duration > 900) {
            await interaction.channel?.send({content: `Didn't add \"${song.title}\" because it's duration is too long`})
            failedAdds++
            continue;
          }
          if(queue?.songs?.includes(song)) {
            await interaction.channel?.send({content: `Didn't add \"${song.title}\" because it's already in the queue`})
            failedAdds++
            continue;
          }
          if(excludeSimilar && checkSimilar(song)) {
            await interaction.channel?.send({content: `Didn't add \"${song.title}\" because a version of it's already in the queue`})
            failedAdds++
            continue;
          }
          queue.enqueue(song);
          extractSongTitle(song);
          lastSuccessfulAdd = index;
          addedSongs++;
          if (interaction.replied)
            await interaction
              .editReply({ content: buildProgressBar(addedSongs, desiredSongs) })
              .catch(console.error);
          else interaction.reply({ content: buildProgressBar(addedSongs, desiredSongs) }).catch(console.error);
        }
        let length = songyt.videos?.length!;
        let lastSongUrl = songyt.videos?.at(lastSuccessfulAdd)?.url!;
        songyt = await YouTube.getVideo(lastSongUrl);
      }
      interaction.deleteReply().catch(console.error);
      return (interaction.channel as TextChannel)
        .send({ content: `${song.title} and ${addedSongs} matching songs have been added to queue. Use /queue to view them` })
        .catch(console.error);
    }

    function extractSongTitle(song: Song) {
      let title = song.title
      title = title.split("(")[0]
      if(title.includes("-")) {
        title = title.split("-")[1]
      }
      if(title.includes("[")) {
        title = title.split("[")[0]
      }
      if(title.includes("|")) {
        title = title.split("|")[0]
      }
      if(title.includes("ft.")) {
        title = title.split("ft.")[0]
      }
      if(title.includes(" feat ")) {
        title = title.split(" feat ")[0]
      }
      if(title.at(0) == " ") {
        title = title.slice(1)
      }
      if(title.at(title.length - 1) == " ") {
        title = title.slice(0, title.length - 1)
      }
      addedSongTitles.push(title);
    }

    function checkSimilar(song: Song) {
      let similar = false
      for (let i = 0; i < addedSongTitles.length; i++) {
        if(song.title.includes(addedSongTitles[i].toString())) {
          similar = true
        }
      }
      return similar;
    }

    function buildProgressBar(addedSongs: number, desiredSongs: number) {
      //determines the Bar length and the chars the bar should be made of
      let BAR_LOADED = "⬜";
      let BAR_NOTLOADED = "⬛";
      let BAR_LENGTH = 40;

      //defines how much of the bar should be filled.
      let bar_added = (addedSongs * BAR_LENGTH) / desiredSongs;

      let bar = "";
      for (let i = BAR_LENGTH; i > 0; i--) {
        bar += bar_added > 0 ? BAR_LOADED : BAR_NOTLOADED;
        bar_added--;
      }
      return `[${bar}] - [${addedSongs}/${desiredSongs}]`;
    }
  }
};
