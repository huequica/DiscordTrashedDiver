import { Client } from 'discord.js';

/**
 * イベントを登録していくための空間
 * @param client イベント登録前の Client オブジェクト
 * @return client イベントを登録したものを返す
 */
export const subscribeEvents = (client: Client): Client => {
  client.once('ready', () => {
    console.log('start discord bot service!');
  });

  client.on('messageReactionAdd', (reaction) => {
    console.log(reaction.emoji.name);
  });

  return client;
};
