import { Client, GuildEmoji } from 'discord.js';
import { EmojiNotFoundError } from '@/lib/exceptions';

/**
 * カスタム emoji を検索する
 * @param client
 * @param name 絵文字の名前 `:party_parrot:` ではなく `party_parrot` の書式
 * @throws EmojiNotFoundError 検索した絵文字が存在しなかった場合のエラー
 */
export const pickEmoji = (client: Client, name: string): GuildEmoji => {
  const pickResult = client.emojis.cache.find((emoji) => emoji.name === name);
  if (!pickResult) throw new EmojiNotFoundError();
  return pickResult;
};
