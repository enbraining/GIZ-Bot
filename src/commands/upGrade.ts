import { ChatInputCommandInteraction, Role, RoleManager, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export default {
  data: new SlashCommandBuilder()
    .setName("up-grade")
    .setDescription("새 학기에 학년을 자동으로 올려줄 때 사용합니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    if(!interaction.memberPermissions?.has("Administrator")) return

    const getRole = async (id: string) => {
      return await interaction.guild?.roles.fetch().then(roles =>
        roles.find(role => role.id === id)  
      ) as Role
    }

    const grades: Role[] = [
      await getRole(process.env.FIRST_ROLE ?? ''),
      await getRole(process.env.SECOND_ROLE ?? ''),
      await getRole(process.env.THIRD_ROLE ?? ''),
    ]

    grades.map((grade, index) => {
      grade.members.map(member => {
        member.roles.remove(grades[index])
        if(index === 0 || index === 1) member.roles.add(grades[index + 1])
        else { if(!member.permissions.has("Administrator")) member.kick() }
      })
    })

    await interaction.reply({
      ephemeral: true,
      content: `성공적으로 학년이 변경되었습니다.`,
    });
  },
} as Command;
