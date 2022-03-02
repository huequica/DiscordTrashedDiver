import 'dotenv/config';
import { Intents } from 'discord.js';

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
export const intents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
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
