import { Client, GatewayIntentBits } from "discord.js";
import express, { Express } from "express";
import { GSM } from "./GSM";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

export const bot = new GSM(client);

const app: Express = express();
const port = 3004;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening at ${port}`);
});