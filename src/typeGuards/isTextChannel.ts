import { MessageReaction, TextChannel } from 'discord.js';

/**
 * reaction から channel Object を返す
 * @param reaction イベントから投げられてきたリアクションメッセージ
 */
export const getChannelFromReaction = (reaction: MessageReaction) =>
  reaction.message.channel;

/**
 * `channel instanceof TextChannel` の wrapper
 * @param channel 正体不明のチャンネルオブジェクト. `reaction.message.channel` から取る
 */
export const isTextChannel = (
  channel: ReturnType<typeof getChannelFromReaction>
): channel is TextChannel => channel.type === 'GUILD_TEXT';
