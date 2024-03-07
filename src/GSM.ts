import { Client, Events, Guild, GuildMember, Interaction, REST, Role, Routes, embedLength } from "discord.js";
import { Command } from "./interfaces/Command";
import { config } from "./utils/config";
import filterMention from "./commands/filterMention";
import kickThird from "./commands/kickThird";

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
      filterMention
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
        member.roles.add(process.env.FIRST_GRADE ?? '');
      }
    });
  }

  private async onGuildMemberUpdate(){
    console.log('BYE GRADUATE')

    this.client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
      if(newMember.displayName.startsWith('delete')) newMember.kick("축 졸업")

      const getRole = async (id: string) => {
        const role = await newMember.guild?.roles.fetch()
        return role?.find(role => role.id == id)
      }

      const getClassList = (grade: number) => {
        switch (grade) {
          case 0: return firstGrade
          case 1: return secondGrade
          case 2: return thirdGrade
          default: return []
        }
      }

      const grades = [
        await getRole(process.env.FIRST_GRADE ?? ''),
        await getRole(process.env.SECOND_GRADE ?? ''),
        await getRole(process.env.THIRD_GRADE ?? ''),
        await getRole(process.env.GRADUATE_GRADE ?? ''),
      ]

      const firstGrade = [
        await getRole(process.env.ONE_ONE ?? ''),
        await getRole(process.env.ONE_TWO ?? ''),
        await getRole(process.env.ONE_THREE ?? ''),
        await getRole(process.env.ONE_FOUR ?? ''),
      ]

      const secondGrade = [
        await getRole(process.env.TWO_ONE ?? ''),
        await getRole(process.env.TWO_TWO ?? ''),
        await getRole(process.env.TWO_THREE ?? ''),
        await getRole(process.env.TWO_FOUR ?? ''),
      ]

      const thirdGrade = [
        await getRole(process.env.THREE_ONE ?? ''),
        await getRole(process.env.THREE_TWO ?? ''),
        await getRole(process.env.THREE_THREE ?? ''),
        await getRole(process.env.THREE_FOUR ?? ''),
      ]

      const [newGrade, oldGrade] = Array(
        Number.parseInt(newMember.displayName.at(0) ?? '') - 1,
        Number.parseInt(oldMember.displayName.at(0) ?? '') - 1,
      )

      const [newClass, oldClass] = Array(
        Number.parseInt(newMember.displayName.at(1) ?? '') - 1,
        Number.parseInt(oldMember.displayName.at(1) ?? '') - 1,
      )

      if(newGrade != oldGrade){
        newMember.roles.add(grades[newGrade] as Role)
        newMember.roles.remove(grades[oldGrade] as Role)
        console.log(newGrade)
      }

      if(newClass != oldClass){
        newMember.roles.add(getClassList(newGrade)[newClass] as Role)
        newMember.roles.remove(getClassList(oldGrade)[oldClass] as Role)
        console.log(newClass)
      }
    }
  )}
}
