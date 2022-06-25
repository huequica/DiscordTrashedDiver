import {
  Client,
  MessageReaction,
  TextBasedChannel,
  TextChannel,
  User,
} from 'discord.js';
import { leakMessage } from '@/actions/leakMessage';
import { removeTweet } from '@/actions/removeTweet';

/**
 * イベントを登録していくための空間
 * @param client イベント登録前の Client オブジェクト
 * @return client イベントを登録したものを返す
 */
export const subscribeEvents = (client: Client): Client => {
  client.once('ready', (client) => {
    // キャッシュに入らないとイベントが発火しないのでテキストチャンネルを一旦取得
    const textChannels = client.channels.cache.filter(
      (channel): channel is TextBasedChannel => channel.isText()
    );

    // その後直近100件のメッセージを fetch してキャッシュさせる
    textChannels.map(async (channel) =>
      channel instanceof TextChannel
        ? await channel.messages.fetch({ limit: 100 })
        : Promise.resolve(undefined)
    );

    console.log('start discord bot service!');
  });

  client.on('messageReactionAdd', (reaction, user) => {
    if (!(reaction instanceof MessageReaction)) return;
    leakMessage(reaction);

    if (!(user instanceof User)) return;
    removeTweet(reaction, user);
  });

  return client;
};
