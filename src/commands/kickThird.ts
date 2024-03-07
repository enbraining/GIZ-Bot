import { ChatInputCommandInteraction, Role, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';

export default {
  data: new SlashCommandBuilder()
    .setName("kick-third")
    .setDescription("(돌이킬 수 없습니다) 3학년 역할을 가진 사람을 퇴장시킵니다."),

  async execute(interaction: ChatInputCommandInteraction) {    
    const thirdGrade = await interaction.guild?.roles.fetch().then(roles =>
      roles.find(role => role.id === process.env.THIRD_GRADE)  
    )

    thirdGrade?.members.map(member => {
      if(!member.permissions.has("Administrator")){
        member.kick()
      }
    })

    await interaction.reply({
      ephemeral: true,
      content: `성공적으로 실행되었습니다.`,
    });
  },
} as Command;
