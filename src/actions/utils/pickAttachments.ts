import { MessageReaction } from 'discord.js';

/**
 * contentType: 画像の場合は `image/png` `image/jpeg` `image/gif` とか
 * url: 名前の通り 送信時のファイル名が末尾にそのまま入るらしい
 * id: discord が割り振るファイルの id
 */
export type omittedAttachment = {
  contentType: string;
  url: string;
  id: string;
};

/**
 * メッセージに付属しているファイルの情報を取得して必要な情報だけ返す
 * @param reaction
 * @see https://discord.js.org/#/docs/main/stable/class/MessageAttachment
 */
export const pickAttachments = (
  reaction: MessageReaction
): omittedAttachment[] => {
  return reaction.message.attachments.map((e) => ({
    contentType: e.contentType || '',
    url: e.url,
    id: e.id,
  }));
};
