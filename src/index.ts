import { Client, Intents } from 'discord.js';
import { DISCORD_TOKEN } from './config/env';
import { subscribeEvents } from './events';

const main = async () => {
  const client = subscribeEvents(
    new Client({ intents: [Intents.FLAGS.GUILDS] })
  );

  await client.login(DISCORD_TOKEN);
};

if (!DISCORD_TOKEN) throw new Error('DISCORD_TOKEN not found in .env File!');
main();
