import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { i18n } from "../utils/i18n";
import { bot } from "../index";

export default {
  data: new SlashCommandBuilder().setName("createpermanentqueue").setDescription("Create a permanent queue for your server in the current VC. Required for full API functionality."),
  async execute(interaction: CommandInteraction) {
    const guildMember = interaction.guild!.members.cache.get(interaction.user.id);
    const { channel } = guildMember!.voice;

    if (!channel)
      return interaction.reply({ content: i18n.__("play.errorNotChannel"), ephemeral: true }).catch(console.error);

      const queue = bot.permanentQueues.get(interaction.guild!.id);
      if (queue) {
        bot.permanentQueues.set(interaction.guild!.id, queue);
        return interaction.reply({ content: "Permanent queue changed to channel " + guildMember!.voice.channel?.name}).catch(console.error);
      } else {
        bot.permanentQueues.set(interaction.guild!.id, interaction);
        return interaction.reply({ content: "Permanent queue created for channel " + guildMember!.voice.channel?.name}).catch(console.error);
      }
  }
};
