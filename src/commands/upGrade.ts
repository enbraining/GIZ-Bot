import { ChatInputCommandInteraction, GuildMember, Role, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export default {
  data: new SlashCommandBuilder()
    .setName("up-grade")
    .setDescription("(ADMINISTRATOR ONLY) 자동으로 모든 인원의 학년을 올려주기 위해서 사용합니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    const getRole = async (id: string) => {
        const role = await interaction.guild?.roles.fetch()
        return role?.find(role => role.id == id)
    }
  
    const grades = [
        await getRole(process.env.FIRST_GRADE ?? ''),
        await getRole(process.env.SECOND_GRADE ?? ''),
        await getRole(process.env.THIRD_GRADE ?? ''),
        await getRole(process.env.GRADUATE_GRADE ?? ''),
    ]

    grades.map((grade, index) => {
        grade?.members.map(member => {
          member.roles.remove(grades[index] ?? '');
          member.roles.add(grades[index + 1] ?? '');
        });
    });

    await interaction.reply({
      ephemeral: true,
      content: `성공적으로 학년이 변경되었습니다.`,
    });
  },
} as Command;
