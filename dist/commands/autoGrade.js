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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("auto-grade")
        .setDescription("새 학기에 학년을 자동으로 올려줄 때 사용합니다."),
    execute(interaction) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = interaction.memberPermissions) === null || _a === void 0 ? void 0 : _a.has("Administrator")))
                return;
            const firstGrade = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find(role => role.id === '1214753898892623913');
            const secondGrade = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(role => role.id === '1214753970942115860');
            const thirdGrade = (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.roles.cache.find(role => role.id === '1214753986519760947');
            firstGrade === null || firstGrade === void 0 ? void 0 : firstGrade.members.map(member => {
                member.roles.remove(firstGrade);
                member.roles.add(secondGrade);
            });
            secondGrade === null || secondGrade === void 0 ? void 0 : secondGrade.members.map(member => {
                member.roles.remove(secondGrade);
                member.roles.add(thirdGrade);
            });
            thirdGrade === null || thirdGrade === void 0 ? void 0 : thirdGrade.members.map(member => {
                member.roles.remove(thirdGrade);
                if (!member.permissions.has("Administrator"))
                    member.kick();
            });
            yield interaction.reply({
                ephemeral: true,
                content: `성공적으로 학년이 변경되었습니다.`,
            });
        });
    },
};
