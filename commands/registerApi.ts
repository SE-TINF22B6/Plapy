import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { i18n } from "../utils/i18n";
import { ApiKey } from "../structs/ApiKey"; // Import the ApiKey class

export default {
  data: new SlashCommandBuilder().setName("registerapi").setDescription(i18n.__("ApiKey")),
  async execute(interaction: CommandInteraction) {
    // Generate a random API key and save it in the database with the user's ID
    const apiKeyEntity = await ApiKey.generateAndSave(interaction.user.id);

    // Send the API key to the user via a private message
    await interaction.user.send("Your API key is: " + apiKeyEntity.key + "\n\nYou can use this key to access the bot's API. Keep it safe and dont share it with anyone !");

    // Inform the user that the API key has been sent to their DMs
    await interaction.reply({ content: 'Check your DMs for the API key!', ephemeral: true });
  }
};