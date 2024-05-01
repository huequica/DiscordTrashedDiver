import { DISCORD_TOKEN, TWITTER_TOKENS, intents } from '@/config/env';
import { subscribeEvents } from '@/events';
import { Client } from 'discord.js';
import { TwitterService } from './lib/services/twitter';

const main = async (discordToken: string) => {
  const discord = new Client({ intents });
  const twitter = new TwitterService();

  const client = subscribeEvents(discord, twitter);

  await client.login(discordToken);
};

const discordToken = DISCORD_TOKEN();
TWITTER_TOKENS(); // 今後使うので先に実行だけしてエラーを起こさないかチェック
main(discordToken);
