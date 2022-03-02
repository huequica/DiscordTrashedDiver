import { Client } from 'discord.js';
import { DISCORD_TOKEN, intents, TWITTER_TOKENS } from '@/config/env';
import { subscribeEvents } from '@/events';

const main = async () => {
  const client = subscribeEvents(new Client({ intents }));

  await client.login(DISCORD_TOKEN);
};

if (!DISCORD_TOKEN) throw new Error('DISCORD_TOKEN not found in .env File!');
TWITTER_TOKENS();
main();
