import { Client, Intents } from 'discord.js';
import { DISCORD_TOKEN } from './config/env';

const main = async () => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

  client.once('ready', () => {
    console.log('start discord bot service!');
  });

  await client.login(DISCORD_TOKEN);
};

if (!DISCORD_TOKEN) throw new Error('DISCORD_TOKEN not found in .env File!');
main();
