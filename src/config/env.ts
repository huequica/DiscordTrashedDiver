import { GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

export const DISCORD_TOKEN = (): string => {
  const env = process.env.DISCORD_TOKEN;
  if (!env) throw Error('DISCORD_TOKEN not found in .env File!');
  return env;
};

export const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
];

export const TWITTER_TOKENS = () => {
  const keys: string[] = [
    process.env.TWITTER_API_KEY,
    process.env.TWITTER_API_SECRET,
    process.env.TWITTER_ACCOUNT_TOKEN,
    process.env.TWITTER_ACCOUNT_SECRET,
  ].filter((key): key is string => typeof key === 'string');

  if (keys.length !== 4)
    throw Error('Caught undefined in twitter info from .env file!');

  return {
    consumer: {
      key: keys[0],
      secret: keys[1],
    },
    account: {
      key: keys[2],
      secret: keys[3],
    },
  };
};

export const BOT_MANAGER_ROLE_ID = (): string => {
  const result = process.env.BOT_MANAGER_ROLE_ID;
  if (!result) {
    throw new Error('Caught undefined in bot manager role id from .env file!');
  }
  return result;
};

export const APPLICATION_TMP_DIRECTORY = '/tmp/huequica/DiscordTrashedDiver';
