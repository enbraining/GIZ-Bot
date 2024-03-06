"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    discordToken: (_a = process.env.DISCORD_TOKEN) !== null && _a !== void 0 ? _a : "",
};
