"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSM = void 0;
const discord_js_1 = require("discord.js");
const _autoGrade_1 = __importDefault(require("./commands/\bautoGrade"));
const config_1 = require("./utils/config");
class GSM {
    constructor(client) {
        this.client = client;
        this.slashCommandMap = new Map();
        this.client.login(config_1.config.discordToken);
        this.client.on("ready", () => {
            var _a, _b;
            console.log(`${(_b = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username) !== null && _b !== void 0 ? _b : ""} ready!`);
            this.registerSlashCommands();
        });
        this.client.on("warn", (info) => console.log(info));
        this.client.on("error", console.error);
        this.onInteractionReceived();
        this.onGuildMemberAdd();
    }
    registerSlashCommands() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const discordREST = new discord_js_1.REST({ version: "10" }).setToken(config_1.config.discordToken);
            const slashCommands = [
                _autoGrade_1.default
            ];
            this.slashCommandMap = slashCommands.reduce((map, command) => {
                map.set(command.data.name, command);
                return map;
            }, new Map());
            yield discordREST.put(discord_js_1.Routes.applicationCommands((_b = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ""), {
                body: slashCommands.map((command) => command.data.toJSON()),
            });
        });
    }
    onInteractionReceived() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(this, void 0, void 0, function* () {
                if (!interaction.isChatInputCommand())
                    return;
                const command = this.slashCommandMap.get(interaction.commandName);
                if (!command)
                    return;
                try {
                    yield command.execute(interaction);
                }
                catch (error) {
                    console.error(error);
                    yield interaction.reply({
                        content: error.toString(),
                    });
                }
            }));
        });
    }
    onGuildMemberAdd() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.on(discord_js_1.Events.GuildMemberAdd, (member) => __awaiter(this, void 0, void 0, function* () {
                member.roles.add('1214753898892623913');
            }));
        });
    }
}
exports.GSM = GSM;
