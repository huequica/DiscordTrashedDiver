import { ReplyMessageOptions } from 'discord.js';

/**
 * 通知を飛ばさないリプライを送信するオブジェクトをつくる
 * @param content リプライ文面
 */
export const buildNoMentionReply = (content: string): ReplyMessageOptions => ({
  content,
  allowedMentions: {
    repliedUser: false,
  },
});
