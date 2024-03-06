import { ChatInputCommandInteraction, Role, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export default {
  data: new SlashCommandBuilder()
    .setName("up-grade")
    .setDescription("새 학기에 학년을 자동으로 올려줄 때 사용합니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    if(!interaction.memberPermissions?.has("Administrator")) return

    const firstGrade = 
    interaction.guild?.roles.cache.find(role => role.id === '1214753898892623913') as Role
    const secondGrade = 
    interaction.guild?.roles.cache.find(role => role.id === '1214753970942115860') as Role
    const thirdGrade = 
    interaction.guild?.roles.cache.find(role => role.id === '1214753986519760947') as Role

    firstGrade?.members.map(member => {
      member.roles.remove(firstGrade)
      member.roles.add(secondGrade)
    })

    secondGrade?.members.map(member => {
      member.roles.remove(secondGrade)
      member.roles.add(thirdGrade)
    })

    thirdGrade?.members.map(member => {
      member.roles.remove(thirdGrade)
      if(!member.permissions.has("Administrator")) member.kick()
    })

    await interaction.reply({
      ephemeral: true,
      content: `성공적으로 학년이 변경되었습니다.`,
    });
  },
} as Command;
