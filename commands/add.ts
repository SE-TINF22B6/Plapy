import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

export default {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription(i18n.__("addToPlaylist.description"))
        .addStringOption((option) =>
            option.setName("playlist").setDescription(i18n.__("addToPlaylist.descriptionOption")).setRequired(true))
        .addStringOption((option) =>
            option.setName("song").setDescription(i18n.__("addToPlaylist.songOption")).setRequired(false)),
    execute(interaction: ChatInputCommandInteraction) {
        const queue = bot.queues.get(interaction.guild!.id);
        const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

        if (interaction.options.getString("playlist") == "test") {
            let song = queue?.songs.at(0)
            const content = { content: `${song?.title} added to playlist test` };

            if (interaction.replied) interaction.followUp(content).catch(console.error);
            else interaction.reply(content).catch(console.error);

            return true;
        }

        const content = { content: i18n.__("resume.errorPlaying") };

        if (interaction.replied) interaction.followUp(content).catch(console.error);
        else interaction.reply(content).catch(console.error);
        return false;
    }
};
