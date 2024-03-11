import { ChatInputCommandInteraction, Role, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';

export default {
  data: new SlashCommandBuilder()
    .setName("grade-notice")
    .setDescription("(돌이킬 수 없습니다) 새 학기에 학년 변경을 위한 공지를 올립니다."),

  async execute(interaction: ChatInputCommandInteraction) {    
    await interaction.reply({
      embeds: [
        {
          title: `새 학기에 역할을 자동으로 부여하기 위해서 진행되는 절차입니다.`,
          description: `
          1. 서버 별명을 학번 + 이름 형식으로 변경해주세요. (ex. 2301 김동학)\n2. 처음으로 봇을 사용하는 경우 제대로 작동하지 않는 경우가 있습니다. 역할이 부여되지 않았다면 다른 닉네임으로 변경했다가 다시 시도해주세요.
          `
        }
      ],
      content: `@everyone`
    });
  },
} as Command;
