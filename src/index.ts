import { Client } from 'discord.js';
import { DISCORD_TOKEN, intents, TWITTER_TOKENS } from '@/config/env';
import { subscribeEvents } from '@/events';

const main = async (discordToken: string) => {
  const client = subscribeEvents(new Client({ intents }));

  await client.login(discordToken);
};

const discordToken = DISCORD_TOKEN();
TWITTER_TOKENS(); // 今後使うので先に実行だけしてエラーを起こさないかチェック
main(discordToken);
