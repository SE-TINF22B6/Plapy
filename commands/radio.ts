import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueue";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { playlistPattern } from "../utils/patterns";
import YouTube from "youtube-sr";

export default {
    data: new SlashCommandBuilder()
        .setName("radio")
        .setDescription(i18n.__("play.description"))
        .addStringOption((option) => option.setName("song").setDescription("The song to base the radio on").setRequired(true))
        .addStringOption((option) => option.setName("songs").setDescription("number of radio songs").setRequired(true)),
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
            let songyt = await YouTube.getVideo(song.url);
            let addedSongs = 0;
            const desiredSongs = Number.parseInt(interaction.options.getString("songs")!);
            while (addedSongs < desiredSongs) {
                for (const {index, value} of songyt.videos!.map((value, index) => ({index, value}))) {
                    if (addedSongs == desiredSongs) break
                    queue.enqueue(await Song.from(value.url));
                    addedSongs++;
                }
                let length = songyt.videos?.length!
                let lastSongUrl = songyt.videos?.at(length! - 1)?.url!
                songyt = await YouTube.getVideo(lastSongUrl)
            }
            return (interaction.channel as TextChannel)
                .send({content: `${song.title} and ${songyt.videos?.length} matching songs have been added to queue`})
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
        let songyt = await YouTube.getVideo(song.url);
        let addedSongs = 0;
        const desiredSongs = Number.parseInt(interaction.options.getString("songs")!);
        while (addedSongs < desiredSongs) {
            for (const {index, value} of songyt.videos!.map((value, index) => ({index, value}))) {
                if (addedSongs == desiredSongs) break
                newQueue.enqueue(await Song.from(value.url));
                addedSongs++;
            }
            let length = songyt.videos?.length!
            let lastSongUrl = songyt.videos?.at(length! - 1)?.url!
            songyt = await YouTube.getVideo(lastSongUrl)
        }
        interaction.deleteReply().catch(console.error);
        return (interaction.channel as TextChannel)
            .send({content: `${song.title} and ${addedSongs} matching songs have been added to queue. Use /queue to view them`})
            .catch(console.error);
    }
};