import { Channel, TextChannel } from 'discord.js';

/**
 * `channel instanceof TextChannel` の wrapper
 * @param channel 正体不明のチャンネルオブジェクト
 */
export const isTextChannel = (channel: Channel): channel is TextChannel =>
  channel instanceof TextChannel;
