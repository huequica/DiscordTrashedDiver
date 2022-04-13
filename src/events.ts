import { Client, MessageReaction, User } from 'discord.js';
import { leakMessage } from '@/actions/leakMessage';
import { removeTweet } from '@/actions/removeTweet';

/**
 * イベントを登録していくための空間
 * @param client イベント登録前の Client オブジェクト
 * @return client イベントを登録したものを返す
 */
export const subscribeEvents = (client: Client): Client => {
  client.once('ready', () => {
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
