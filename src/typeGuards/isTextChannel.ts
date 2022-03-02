import { TextChannel } from 'discord.js';

/**
 * `channel instanceof TextChannel` の wrapper
 * @param channel 正体不明のチャンネルオブジェクト. `reaction.message.channel` から取る
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTextChannel = (channel: any): channel is TextChannel =>
  typeof channel.name === 'string';
