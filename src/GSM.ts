import { Client, EmbedBuilder, Events, GuildMember, Interaction, REST, Role, Routes, TextChannel } from "discord.js";
import gradeNotice from "./commands/gradeNotice";
import kickThird from "./commands/kickThird";
import { Command } from "./interfaces/Command";
import { config } from "./utils/config";

export class GSM {
  private slashCommandMap = new Map<string, Command>();

  public constructor(private readonly client: Client) {
    this.client.login(config.discordToken);

    this.client.on("ready", () => {
      console.log(`${this.client.user?.username ?? ""} ready!`);

      this.registerSlashCommands();
    });

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    this.onInteractionReceived();
    this.onGuildMemberAdd();  
    this.onGuildMemberUpdate();
  }

  private async registerSlashCommands() {
    const discordREST = new REST({ version: "10" }).setToken(
      config.discordToken,
    );
    const slashCommands: Array<Command> = [
      kickThird,
      gradeNotice
    ];

    this.slashCommandMap = slashCommands.reduce((map, command) => {
      map.set(command.data.name, command);
      return map;
    }, new Map<string, Command>());

    await discordREST.put(
      Routes.applicationCommands(this.client.user?.id ?? ""),
      {
        body: slashCommands.map((command) => command.data.toJSON()),
      },
    );
  }

  private async onInteractionReceived() {
    this.client.on(
      Events.InteractionCreate,
      async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = this.slashCommandMap.get(interaction.commandName);

        if (!command || 
          interaction.guildId != process.env.GUILD_ID ||
          !interaction.memberPermissions?.has("Administrator")  
        ) return;

        try {
          await command.execute(interaction);
        } catch (error: any) {
          console.error(error);

          await interaction.reply({
            content: error.toString(),
          });
        }
      },
    );
  }

  private async onGuildMemberAdd() {
    this.client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
      const guildId = process.env.GUILD_ID ?? '';

      if(member.guild.id == guildId){
        member.roles.add(process.env.STUDENT_ROLE ?? '');

        member.send({
          embeds: [
            {
              title: `${member.guild.name}`,
              description: `
              서버 별명을 학번과 이름으로 변경해주세요. ex. 2301 김동학\n
              제대로 역할이 부여되지 않았다면 다른 닉네임으로 변경했다가 다시 시도해주세요.
              `
            }
          ],
        })
      }
    });
  }

  private async onGuildMemberUpdate(){
    this.client.on('guildMemberUpdate', async (oldMember, newMember) => {
      const newGrade = parseInt(newMember.displayName.at(0) ?? '1') - 1
      const newClass = parseInt(newMember.displayName.at(1) ?? '1') - 1

      if(newGrade < 0 || newGrade > 2 || newClass < 0 || newClass > 3) return

      const getRole = async (id: string) => {
        const role = await newMember.guild?.roles.fetch()
        return role?.find(role => role.id == id) as Role
      }

      const allGrade = [
        await getRole(process.env.FIRST_GRADE ?? ''),
        await getRole(process.env.SECOND_GRADE ?? ''),
        await getRole(process.env.THIRD_GRADE ?? ''),
        await getRole(process.env.GRADUATE_GRADE ?? ''),
      ]

      const firstGradeClass: Role[] = [
        await getRole(process.env.ONE_ONE ?? ''),
        await getRole(process.env.ONE_TWO ?? ''),
        await getRole(process.env.ONE_THREE ?? ''),
        await getRole(process.env.ONE_FOUR ?? ''),
      ]

      const secondGradeClass: Role[] = [
        await getRole(process.env.TWO_ONE ?? ''),
        await getRole(process.env.TWO_TWO ?? ''),
        await getRole(process.env.TWO_THREE ?? ''),
        await getRole(process.env.TWO_FOUR ?? ''),
      ]

      const thirdGradeClass: Role[] = [
        await getRole(process.env.THREE_ONE ?? ''),
        await getRole(process.env.THREE_TWO ?? ''),
        await getRole(process.env.THREE_THREE ?? ''),
        await getRole(process.env.THREE_FOUR ?? ''),
      ]

      const getClassList = (grade: number) => {
        switch (grade) {
          case 0: return firstGradeClass
          case 1: return secondGradeClass
          case 2: return thirdGradeClass
          default: return []
        }
      }

      if(newMember.displayName != oldMember.displayName){
        newMember.send({
          embeds: [
            new EmbedBuilder({
              description: `
              모든 변경 내역은 기록되고 있습니다. 신중히 변경해주세요.
              제대로 역할이 부여되지 않았다면 다른 닉네임으로 변경했다가 다시 시도해주세요.
              `
            })
          ]
        })
        const logChannel = await newMember.guild.channels.cache.get(process.env.LOG_CHANNEL ?? '') as TextChannel
        logChannel.send(`${oldMember.displayName} -> ${newMember.displayName}`)

        try {
          newMember.roles.add(allGrade[newGrade] as Role)
          newMember.roles.add(getClassList(newGrade)[newClass] as Role)

          for(let i = 0; i <= 2; i++){
            if(newGrade === i) { 
              getClassList(i).map((grade, index) => {
                if(index != newClass) newMember.roles.remove(grade)
              })
            } else getClassList(i).map(grade => newMember.roles.remove(grade))
          }

          allGrade.filter(grade => grade?.id != allGrade[newGrade]?.id).map(grade => {
            newMember.roles.remove(grade.id)
          }) 
        } catch(error){
          console.log(error)
        }
      }
    }
  )}
}
