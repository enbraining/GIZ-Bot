import { ChatInputCommandInteraction, GuildMember, Role, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("서버의 상태를 체크합니다."),

  async execute(interaction: ChatInputCommandInteraction) {  
    await interaction.reply({
      content: `🌱 Latency: ${Date.now() - interaction.createdTimestamp}ms.`,
    });
  },
} as Command;
