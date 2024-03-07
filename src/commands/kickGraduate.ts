import { ChatInputCommandInteraction, Role, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';

export default {
  data: new SlashCommandBuilder()
    .setName("kick-graduate")
    .setDescription("(돌이킬 수 없습니다) /up-grade 명령어를 사용한 후에 졸업생 역할을 가진 인원을 퇴장시키기 위해서 사용합니다."),

  async execute(interaction: ChatInputCommandInteraction) {    
    const graduateRole = await interaction.guild?.roles.fetch().then(roles =>
      roles.find(role => role.id === process.env.GRADUATE_GRADE)  
    ) as Role

    graduateRole.members.map(member => {
      member.kick("Graduate [GIZ-BOT]")
    })

    await interaction.reply({
      ephemeral: true,
      content: `성공적으로 학년이 변경되었습니다.`,
    });
  },
} as Command;
