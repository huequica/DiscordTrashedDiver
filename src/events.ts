import { leakMessage } from '@/actions/leakMessage';
import { removeTweet } from '@/actions/removeTweet';
import {
  Client,
  MessageReaction,
  TextBasedChannel,
  TextChannel,
  User,
} from 'discord.js';
import { TwitterService } from './lib/services/twitter';

/**
 * イベントを登録していくための空間
 * @param discord イベント登録前の Client オブジェクト
 * @param twitter twitter へ投稿するための TwitterService
 * @return client イベントを登録したものを返す
 */
export const subscribeEvents = (
  discord: Client,
  twitter: TwitterService,
): Client => {
  discord.once('ready', (client) => {
    // キャッシュに入らないとイベントが発火しないのでテキストチャンネルを一旦取得
    const textChannels = client.channels.cache.filter(
      (channel): channel is TextBasedChannel => channel.isTextBased(),
    );

    // その後直近100件のメッセージを fetch してキャッシュさせる
    textChannels.map(async (channel) =>
      channel instanceof TextChannel
        ? await channel.messages.fetch({ limit: 100 })
        : Promise.resolve(undefined),
    );

    console.log('start discord bot service!');
  });

  discord.on('messageReactionAdd', (reaction, user) => {
    if (!(reaction instanceof MessageReaction)) return;
    leakMessage(reaction, twitter);

    if (!(user instanceof User)) return;
    removeTweet(reaction, user, twitter);
  });

  return discord;
};
