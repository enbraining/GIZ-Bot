import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } from 'discord.js';
import { Command } from '../interfaces/Command';
import { config } from '../utils/config';
import roles from '../utils/roles';

export default {
  data: new SlashCommandBuilder()
    .setName("update-grade")
    .setDescription("역할과 이름을 수정합니다.")
    .addStringOption((role: SlashCommandStringOption) =>
        role.setName('name').setDescription('실제 본명을 입력해주세요.').setRequired(true)
    ).addIntegerOption((role: SlashCommandIntegerOption) =>
        role.setName('grade').setDescription('현재 학년을 입력해주세요.').setRequired(true)
    ).addIntegerOption((role: SlashCommandIntegerOption) =>
        role.setName('class').setDescription('현재 반을 입력해주세요.').setRequired(true)
    ).addIntegerOption((role: SlashCommandIntegerOption) =>
        role.setName('number').setDescription('현재 번호를 입력해주세요.').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const inputMember = interaction.member as GuildMember
    const { inputName, inputGrade, inputClass, inputNumber } = {
        inputName: interaction.options.getString("name")!,
        inputGrade: interaction.options.getInteger("grade")!,
        inputClass: interaction.options.getInteger("class")!,
        inputNumber: interaction.options.getInteger("number")!,
    }

    if(
        inputName.length > 6 ||
        inputGrade < 1 || inputGrade > 3 ||
        inputClass < 1 || inputClass > 4 ||
        inputNumber < 1 || inputNumber > 99
    ){
        await interaction.reply({
            ephemeral: true,
            content: `학년, 반, 혹은 번호가 올바르지 않습니다.`,
        })
        return
    }

    inputMember.setNickname(`${inputGrade}${inputClass}${inputNumber?.toString().padStart(2, '0')} ${inputName}`)

    const roleIds = getRole(inputGrade, inputClass)
    const studentRole = await interaction.guild?.roles.fetch(config.studentRoleId)
    const gradeRole = await interaction.guild?.roles.fetch(roleIds.thisGrade)
    const classRole = await interaction.guild?.roles.fetch(roleIds.thisClass)

    const prevRoleIds = inputMember.roles.valueOf().map(prevRole => prevRole.id)
    const allRoles = [...roles().classes, ...roles().grades].flat();

    if(gradeRole && classRole && studentRole){
        const filteredRoleIds = prevRoleIds.filter(prevRoleId =>
            allRoles.includes(prevRoleId) &&
            prevRoleId != roleIds.thisClass &&
            prevRoleId != roleIds.thisGrade
        )

        await inputMember.roles.add([studentRole, gradeRole, classRole])
        await inputMember.roles.remove(filteredRoleIds)
    }

    await interaction.reply({
      ephemeral: true,
      content: `성공적으로 실행되었습니다.`,
    });
  },
} as Command;

function getRole(inputGrade: number, inputClass: number) {
    const thisGrade: string = roles().grades[inputGrade - 1]
    const thisClass: string = roles().classes[inputGrade - 1].at(inputClass - 1)!

    return {
        thisGrade,
        thisClass
    }
}
