import 'dotenv/config';
import { Intents } from 'discord.js';

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
export const intents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
];
