import { ChatInputCommandInteraction, GuildMember, Role, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export default {
  data: new SlashCommandBuilder()
    .setName("mention")
    .setDescription("(ADMINISTRATOR ONLY) 역할에 대해 필터링해서 언급할 수 있습니다.")
    .addRoleOption((role: any) => role
        .setName('first')
        .setDescription('해당 역할을 포함해서 언급합니다.')
        .setRequired(true)
    )
    .addRoleOption((role: any) => role
        .setName('second')
        .setDescription('해당 역할도 포함해서 언급합니다.')
        .setRequired(false)
    )
    .addRoleOption((role: any) => role
        .setName('third')
        .setDescription('해당 역할도 포함해서 언급합니다.')
        .setRequired(false)
    ),

    async execute(interaction: ChatInputCommandInteraction) {
        const firstRole = interaction.options.getRole('a') as Role
        const secondRole = interaction.options.getRole('b') as Role
        const thirdRole = interaction.options.getRole('c') as Role

        const members = await interaction.guild?.members;
    
        const roleMembers = await members?.fetch().then((members) =>
        members.filter((member) =>
            member.roles.cache.has(firstRole.id) &&
            (!secondRole || member.roles.cache.has(secondRole.id)) &&
            (!thirdRole || member.roles.cache.has(thirdRole.id))
        )
    )

    if(roleMembers){
      await interaction.reply({
        content: `${roleMembers?.map((member: GuildMember) => member.toString()).join(' ')}`,
      });
    } else {
      await interaction.reply('해당 역할을 가진 멤버 목록을 불러오지 못했습니다.')
    }
  }
} as Command;